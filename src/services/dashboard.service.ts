import { prisma } from "../config/prisma";
import { GetSummaryQuery } from "../schemas/dashboard.schema";

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
