import { prisma } from "../config/prisma";
import { GetSummaryQuery } from "../schemas/dashboard.schema";

export const getSummary = async (userId: string, filter: GetSummaryQuery) => {
	const { month, year } = filter;
	const startDate = new Date(year, month - 1, 1);
	const endDate = new Date(year, month, 1);

	// Agregasi: Kelompokkan berdasarkan 'type', lalu jumlahkan 'amount'
	const stats = await prisma.transaction.groupBy({
		by: ["type"],
		where: {
			userId,
			transactionDate: {
				gte: startDate,
				lt: endDate,
			},
		},
		_sum: {
			amount: true,
		},
	});

	// Mapping hasil agregasi ke format yang enak dibaca Frontend
	let total_income = 0;
	let total_expense = 0;

	stats.forEach((item) => {
		const sum = Number(item._sum.amount) || 0;
		if (item.type === "income") total_income = sum;
		if (item.type === "expense") total_expense = sum;
	});

	return {
		month,
		year,
		total_income,
		total_expense,
		balance: total_income - total_expense,
	};
};
