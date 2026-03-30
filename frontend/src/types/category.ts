export type TransactionType = "income" | "expense";

export interface Category {
	id: string;
	name: string;
	type: TransactionType;
	userId: string;
	createdAt: string;
	updatedAt: string;
}

export interface CreateCategoryInput {
	name: string;
	type: TransactionType;
}
