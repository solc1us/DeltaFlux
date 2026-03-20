import { prisma } from "../config/prisma";
import { AppError } from "../utils/app.error";
import { CreateCategoryInput } from "../schemas/category.schema";
import { UpdateCategoryInput } from "../schemas/category.schema";

export const createCategory = async (
	userId: string,
	data: CreateCategoryInput,
) => {
	// Check for duplicate name + type for the same user
	const existing = await prisma.category.findFirst({
		where: {
			name: { equals: data.name, mode: "insensitive" },
			type: data.type,
			userId,
		},
	});

	if (existing)
		throw new AppError(400, "Category already exists for this type");

	return await prisma.category.create({
		data: {
			...data, // Spread data (name & type)
			userId,
		},
	});
};

export const getAllCategories = async (userId: string) => {
	return await prisma.category.findMany({
		where: { userId },
		orderBy: { name: "asc" },
	});
};

export const updateCategory = async (
	userId: string,
	id: string,
	data: UpdateCategoryInput,
) => {
	// 1. Ambil data lama buat pembanding
	const category = await prisma.category.findFirst({ where: { id, userId } });
	if (!category) throw new AppError(404, "Category not found");

	// 2. Logic Lock: Kalau user coba ganti 'type'
	if (data.type && data.type !== category.type) {
		const hasTransactions = await prisma.transaction.count({
			where: { categoryId: id },
		});

		if (hasTransactions > 0) {
			throw new AppError(
				400,
				"Cannot change category type because it already has associated transactions",
			);
		}
	}

	// 3. Duplicate Check: Kalau ganti nama/type, pastiin gak nabrak kategori lain
	if (data.name || data.type) {
		const existing = await prisma.category.findFirst({
			where: {
				id: { not: id }, // Kecualikan diri sendiri
				name: { equals: data.name || category.name, mode: "insensitive" },
				type: data.type || category.type,
				userId,
			},
		});
		if (existing)
			throw new AppError(
				400,
				"Another category with this name and type already exists",
			);
	}

	// 4. Update dengan mapping yang ketat
	return await prisma.category.update({
		where: { id },
		data: {
			...(data.name && { name: data.name }),
			...(data.type && { type: data.type }),
		},
	});
};

export const deleteCategory = async (userId: string, id: string) => {
	const category = await prisma.category.findFirst({ where: { id, userId } });
	if (!category) throw new AppError(404, "Category not found");

	// Business Logic: Cek apakah ada transaksi yang pakai kategori ini
	const transactionCount = await prisma.transaction.count({
		where: { categoryId: id },
	});
	if (transactionCount > 0) {
		throw new AppError(
			400,
			"Cannot delete category that has transactions. Move the transactions first.",
		);
	}

	return await prisma.category.delete({ where: { id } });
};
