import { z } from 'zod';

const TRANSACTION_TYPES = ['income', 'expense'] as const;

export const createTransactionSchema = z.object({
  body: z.object({
    type: z.enum(TRANSACTION_TYPES, {
      error: "Type must be 'income' or 'expense'",
    }),
    amount: z.number().positive('Amount must be greater than 0'),
    category_id: z.uuid('Invalid category ID format'),
    source: z.string().min(1, 'Source is required (e.g., atm, gopay, cash)'),
    description: z.string().optional(),
    transaction_date: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid date format, use YYYY-MM-DD",
    }),
  }),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>['body'];