import { prisma } from "../config/prisma";
import { GetSummaryQuery } from "../schemas/dashboard.schema";

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

export const getSummary = async (userId: string, filter: GetSummaryQuery) => {
	const { month, year } = filter;

	const currentStart = new Date(year, month - 1, 1);
	const currentEnd = new Date(year, month, 1);
	const prevStart = new Date(year, month - 2, 1);
	const prevEnd = new Date(year, month - 1, 1);

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
