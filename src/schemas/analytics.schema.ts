import { z } from "zod";

export const getSummarySchema = z.object({
	query: z.object({
		month: z
			.string()
			.regex(/^(0?[1-9]|1[0-2])$/, "Month must be 1-12")
			.transform(Number),
		year: z
			.string()
			.regex(/^\d{4}$/, "Year must be a 4-digit number")
			.transform(Number),
	}),
});

export type GetSummaryQuery = z.infer<typeof getSummarySchema>["query"];
