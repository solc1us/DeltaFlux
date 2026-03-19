import { prisma } from "../config/prisma";
import {
	CreateTransactionInput,
	UpdateTransactionInput,
	GetTransactionsQuery,
} from "../schemas/transaction.schema";
import { AppError } from "../utils/app.error";
import { Prisma } from "@prisma/client";

export const createTransaction = async (
	userId: string,
	data: CreateTransactionInput,
) => {
	// 1. Validasi Kategori: Harus ada dan milik user tersebut
	const category = await prisma.category.findFirst({
		where: { id: data.category_id, userId },
	});

	if (!category) {
		throw new AppError(404, "Category not found or access denied");
	}

	// 2. Data Integrity: Validasi Redundancy (Type Transaction must match Category Type)
	if (category.type !== data.type) {
		throw new AppError(
			400,
			`Mismatch: Category is ${category.type} but transaction is ${data.type}`,
		);
	}

	// 3. Execution dengan Decimal Precision
	return await prisma.transaction.create({
		data: {
			amount: new Prisma.Decimal(data.amount),
			type: data.type,
			source: data.source,
			// Zod optional (undefined) dikonversi ke null untuk Prisma
			description: data.description ?? null,
			// Date object akan otomatis di-map ke PostgreSQL DATE type (YYYY-MM-DD)
			transactionDate: new Date(data.transaction_date),
			userId,
			categoryId: data.category_id,
		},
	});
};

// Get All Transactions with Basic Filtering (month, year, category_id)
export const getAllTransactions = async (
	userId: string,
	filter: GetTransactionsQuery,
) => {
	const { month, year, category_id } = filter;

	// Inisialisasi object 'where'
	const where: any = { userId };

	// Logic Filter Tanggal
	if (month && year) {
		const startDate = new Date(year, month - 1, 1); // Awal bulan
		const endDate = new Date(year, month, 1); // Awal bulan berikutnya

		where.transactionDate = {
			gte: startDate,
			lt: endDate, // Mencakup semua sampai akhir bulan (excl. tgl 1 bulan depan)
		};
	}

	// Logic Filter Kategori
	if (category_id) {
		where.categoryId = category_id;
	}

	return await prisma.transaction.findMany({
		where,
		orderBy: { transactionDate: "desc" },
		include: {
			category: { select: { name: true, type: true } },
		},
	});
};

// Get Single Transaction
export const getTransactionById = async (userId: string, id: string) => {
	const transaction = await prisma.transaction.findFirst({
		where: { id, userId },
		include: { category: true },
	});

	if (!transaction) throw new AppError(404, "Transaction not found");
	return transaction;
};

// Update Transaction
export const updateTransaction = async (
	userId: string,
	id: string,
	data: UpdateTransactionInput,
) => {
	// 1. Ownership Check
	const transaction = await prisma.transaction.findFirst({
		where: { id, userId },
	});

	if (!transaction) throw new AppError(404, "Transaction not found");

	// 2. Logic Validation if category/type changed
	if (data.category_id) {
		const category = await prisma.category.findFirst({
			where: { id: data.category_id, userId },
		});

		if (!category) throw new AppError(404, "Category not found");

		// Validasi silang antara type input baru (atau lama) dengan kategori baru
		const currentType = data.type || transaction.type;
		if (category.type !== currentType) {
			throw new AppError(400, "Transaction type mismatch with new category");
		}
	}

	// 3. Update with strict mapping
	return await prisma.transaction.update({
		where: { id },
		data: {
			...(data.amount && { amount: new Prisma.Decimal(data.amount) }),
			...(data.type && { type: data.type }),
			...(data.source && { source: data.source }),
			...(data.transaction_date && {
				transactionDate: new Date(data.transaction_date),
			}),
			...(data.category_id && { categoryId: data.category_id }),

			// Khusus description, kita handle null-safety-nya secara manual
			...(data.description !== undefined && { description: data.description }),
		},
	});
};

// Delete Transaction
export const deleteTransaction = async (userId: string, id: string) => {
	const transaction = await prisma.transaction.findFirst({
		where: { id, userId },
	});
	if (!transaction) throw new AppError(404, "Transaction not found");

	return await prisma.transaction.delete({ where: { id } });
};
