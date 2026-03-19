import { z } from 'zod';

const TRANSACTION_TYPES = ['income', 'expense'] as const;

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Category name is required'),
    type: z.enum(TRANSACTION_TYPES, {
      error: "Type must be 'income' or 'expense'",
    }),
  }),
});