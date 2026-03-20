import { prisma } from "../config/prisma";
import { GetSummaryQuery } from "../schemas/dashboard.schema";

export const getCategoryDeviation = async (
	userId: string,
	filter: GetSummaryQuery,
) => {
	const { month, year } = filter;
	const THRESHOLD = 20; // Hardcoded 20%

	const currentStart = new Date(year, month - 1, 1);
	const currentEnd = new Date(year, month, 1);
	const prevStart = new Date(year, month - 2, 1);
	const prevEnd = new Date(year, month - 1, 1);

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
