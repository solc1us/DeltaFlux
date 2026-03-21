import { Response, NextFunction } from "express";
import * as analyticsService from "../services/analytics.service";
import { AuthenticatedRequest } from "../types";
import { GetSummaryQuery } from "../schemas/analytics.schema";

/**
 * Handle Get Top Categories
 * Route: GET /api/analytics/top-categories
 */
export async function getTopCategories(
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction,
) {
	try {
		// Validasi query parameters dilakukan di route dengan Zod, jadi di sini kita asumsikan sudah valid
		const query = req.query as unknown as GetSummaryQuery;
		const topCategories = await analyticsService.getTopCategories(
			req.user!.id,
			query,
		);

		// Response dengan format yang konsisten
		res.status(200).json({
			status: "success",
			data: { top_categories: topCategories },
		});
	} catch (err) {
		next(err);
	}
}

/**
 * Handle Get Summary
 * Route: GET /api/analytics/summary
 */
export async function getSummary(
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction,
) {
	try {
		// Validasi query parameters dilakukan di route dengan Zod, jadi di sini kita asumsikan sudah valid
		const query = req.query as unknown as GetSummaryQuery;
		const summary = await analyticsService.getSummary(req.user!.id, query);

		// Response dengan format yang konsisten
		res.status(200).json({
			status: "success",
			data: summary,
		});
	} catch (err) {
		next(err);
	}
}

/**
 * Handle Get Category Deviation
 * Route: GET /api/analytics/deviation
 */
export async function getCategoryDeviation(
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction,
) {
	try {
		// Validasi query parameters dilakukan di route dengan Zod, jadi di sini kita asumsikan sudah valid
		const query = req.query as unknown as GetSummaryQuery;
		const data = await analyticsService.getCategoryDeviation(
			req.user!.id,
			query,
		);

		res.status(200).json({
			status: "success",
			data,
		});
	} catch (err) {
		next(err);
	}
}
