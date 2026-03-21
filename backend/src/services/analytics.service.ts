import { prisma } from "../config/prisma";
import { GetSummaryQuery } from "../schemas/analytics.schema";

/**
 * Identify the top expense categories for a month and compute month-over-month growth.
 * Compares current vs previous month and returns `mom_growth = null` when previous amount is zero to avoid division-by-zero; limits results to the top 3 expense categories.
 * Handles missing previous-month data and maps category names safely.
 * @param {string} userId
 * @param {GetSummaryQuery} filter
 * @returns {Promise<Array<{category_id: string; category_name: string; amount: number; mom_growth: number | null}>>}
 */
export const getTopCategories = async (
	userId: string,
	filter: GetSummaryQuery,
) => {
	const { month, year } = filter;
	const currentStart = new Date(year, month - 1, 1);
	const currentEnd = new Date(year, month, 1);
	const prevStart = new Date(year, month - 2, 1);
	const prevEnd = new Date(year, month - 1, 1);

	// 1. Ambil data agregasi Top Categories bulan ini (Hanya Expense)
	const currentTop = await prisma.transaction.groupBy({
		by: ["categoryId"],
		where: {
			userId,
			type: "expense",
			transactionDate: { gte: currentStart, lt: currentEnd },
		},
		_sum: { amount: true },
		orderBy: { _sum: { amount: "desc" } },
		take: 3,
	});

	// 2. Ambil data pembanding bulan lalu untuk kategori-kategori yang masuk Top 3 tadi
	const categoryIds = currentTop.map((c) => c.categoryId);
	const prevTop = await prisma.transaction.groupBy({
		by: ["categoryId"],
		where: {
			userId,
			categoryId: { in: categoryIds },
			transactionDate: { gte: prevStart, lt: prevEnd },
		},
		_sum: { amount: true },
	});

	// 3. Mapping data dengan Category Name & MoM Growth
	const results = await Promise.all(
		currentTop.map(async (item) => {
			const category = await prisma.category.findUnique({
				where: { id: item.categoryId },
				select: { name: true },
			});

			const currentAmount = Number(item._sum.amount) || 0;
			const prevMatch = prevTop.find((p) => p.categoryId === item.categoryId);
			const prevAmount = prevMatch ? Number(prevMatch._sum.amount) : 0;

			// Edge Case: Jika kategori tidak memiliki nilai pada bulan lalu -> MoM null
			const momGrowth =
				prevAmount > 0
					? parseFloat(
							(((currentAmount - prevAmount) / prevAmount) * 100).toFixed(2),
						)
					: null;

			return {
				category_id: item.categoryId,
				category_name: category?.name || "Unknown",
				amount: currentAmount,
				mom_growth: momGrowth,
			};
		}),
	);

	return results;
};

/**
 * Produce a monthly summary with current and previous totals and growth percentages.
 * Returns `analysis = null` if there are no previous-month transactions to avoid misleading growth values; growth calculations are rounded to two decimals.
 * Ensures UTC-boundary calculations to avoid timezone drift when computing month ranges.
 * @param {string} userId
 * @param {GetSummaryQuery} filter
 * @returns {Promise<{month: number; year: number; current: {income: number; expense: number; balance: number}; previous: {income: number; expense: number}; analysis: {income_growth: number | null; expense_growth: number | null} | null; metadata: {has_previous_data: boolean}}>}
 */
export const getSummary = async (userId: string, filter: GetSummaryQuery) => {
	const { month, year } = filter;

	const currentStart = new Date(Date.UTC(year, month - 1, 1));
	const currentEnd = new Date(Date.UTC(year, month, 1));
	const prevStart = new Date(Date.UTC(year, month - 2, 1));
	const prevEnd = new Date(Date.UTC(year, month - 1, 1));

	const [currentStats, prevStats] = await Promise.all([
		getMonthlyStats(userId, currentStart, currentEnd),
		getMonthlyStats(userId, prevStart, prevEnd),
	]);

	// Logic Edge Case: Cek apakah bulan lalu ada transaksi sama sekali
	const hasPrevTransactions = prevStats.income > 0 || prevStats.expense > 0;

	const calculateGrowth = (current: number, previous: number) => {
		// Edge Case 1: Jika bulan lalu 0, jangan tampilkan deviasi (return null/undefined)
		if (previous === 0) return null;

		// Edge Case 3: Nilai negatif tidak digunakan (pake Math.abs atau logic pemisahan)
		// Karena income & expense sudah dipisah, kita hitung growth murni dari besaran angkanya
		const growth = ((current - previous) / previous) * 100;
		return parseFloat(growth.toFixed(2));
	};

	return {
		month,
		year,
		current: {
			income: currentStats.income,
			expense: currentStats.expense,
			balance: currentStats.income - currentStats.expense,
		},
		previous: {
			income: prevStats.income,
			expense: prevStats.expense,
		},
		// Jika tidak ada transaksi bulan lalu, analisis deviasi (MoM) dikirim null
		analysis: hasPrevTransactions
			? {
					income_growth: calculateGrowth(currentStats.income, prevStats.income),
					expense_growth: calculateGrowth(
						currentStats.expense,
						prevStats.expense,
					),
				}
			: null,
		metadata: {
			has_previous_data: hasPrevTransactions,
		},
	};
};

// Private Helper Service
/**
 * Aggregates income and expense totals for a UTC-bounded date range.
 * Returns zeros for missing types to make calling code simple and avoid undefined handling.
 * @param {string} userId
 * @param {Date} start
 * @param {Date} end
 * @returns {Promise<{income: number; expense: number}>}
 */
async function getMonthlyStats(userId: string, start: Date, end: Date) {
	const stats = await prisma.transaction.groupBy({
		by: ["type"],
		where: { userId, transactionDate: { gte: start, lt: end } },
		_sum: { amount: true },
	});

	let income = 0;
	let expense = 0;
	stats.forEach((s) => {
		const val = Number(s._sum.amount) || 0;
		if (s.type === "income") income = val;
		if (s.type === "expense") expense = val;
	});

	return { income, expense };
}

/**
 * Compute per-category month-over-month percentage deviations for expense categories.
 * Marks `momPercentage = null` when previous total is zero and flags significant deviations using a configurable threshold (hardcoded 20% here).
 * Filters out categories with no activity in both months to keep responses concise.
 * @param {string} userId
 * @param {GetSummaryQuery} filter
 * @returns {Promise<Array<{categoryId: string; categoryName: string; currentTotal: number; previousTotal: number; momPercentage: number | null; isSignificant: boolean}>>}
 */
export const getCategoryDeviation = async (
	userId: string,
	filter: GetSummaryQuery,
) => {
	const { month, year } = filter;
	const THRESHOLD = 20; // Hardcoded 20%

	const currentStart = new Date(Date.UTC(year, month - 1, 1));
	const currentEnd = new Date(Date.UTC(year, month, 1));
	const prevStart = new Date(Date.UTC(year, month - 2, 1));
	const prevEnd = new Date(Date.UTC(year, month - 1, 1));

	// 1. Ambil semua kategori Expense milik user
	const categories = await prisma.category.findMany({
		where: { userId, type: "expense" },
		select: { id: true, name: true },
	});

	// 2. Agregasi Expense per kategori - Bulan Ini & Bulan Lalu (Parallel)
	const [currentGroups, prevGroups] = await Promise.all([
		prisma.transaction.groupBy({
			by: ["categoryId"],
			where: {
				userId,
				type: "expense",
				transactionDate: { gte: currentStart, lt: currentEnd },
			},
			_sum: { amount: true },
		}),
		prisma.transaction.groupBy({
			by: ["categoryId"],
			where: {
				userId,
				type: "expense",
				transactionDate: { gte: prevStart, lt: prevEnd },
			},
			_sum: { amount: true },
		}),
	]);

	// 3. Mapping Deviation Logic
	const deviations = categories.map((cat) => {
		const currentData = currentGroups.find((g) => g.categoryId === cat.id);
		const prevData = prevGroups.find((g) => g.categoryId === cat.id);

		const currentTotal = Number(currentData?._sum.amount) || 0;
		const previousTotal = Number(prevData?._sum.amount) || 0;

		let momPercentage: number | null = null;
		let isSignificant = false;

		// Logic: Jika bulan lalu > 0 → hitung MoM %
		if (previousTotal > 0) {
			momPercentage = parseFloat(
				(((currentTotal - previousTotal) / previousTotal) * 100).toFixed(2),
			);
			// Jika nilai absolut MoM % melebihi threshold 20%
			if (Math.abs(momPercentage) > THRESHOLD) {
				isSignificant = true;
			}
		}

		return {
			categoryId: cat.id,
			categoryName: cat.name,
			currentTotal,
			previousTotal,
			momPercentage, // null jika bulan lalu 0 (aktivitas baru)
			isSignificant,
		};
	});

	// Opsional: Filter kategori yang beneran ada transaksi di bulan ini atau bulan lalu aja biar gak menuhin response
	return deviations.filter((d) => d.currentTotal > 0 || d.previousTotal > 0);
};
