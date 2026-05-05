import { z } from "zod";

const TRANSACTION_TYPES = ["income", "expense"] as const;

export const createCategorySchema = z.object({
	body: z.object({
		name: z
			.string()
			.trim()
			.min(1, "Category name is required")
			.max(25, "Category name must be less than 25 characters"),
		type: z.enum(TRANSACTION_TYPES, {
			error: "Type must be 'income' or 'expense'",
		}),
	}),
});

export const updateCategorySchema = z.object({
	params: z.object({
		id: z.uuid("Invalid category ID"),
	}),
	body: z.object({
		name: z.string().trim().min(1).max(50).optional(),
		type: z.enum(TRANSACTION_TYPES).optional(),
	}),
});

export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>["body"];
export type CreateCategoryInput = z.infer<typeof createCategorySchema>["body"];
