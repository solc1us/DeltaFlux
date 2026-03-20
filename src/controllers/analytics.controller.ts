import { Response, NextFunction } from "express";
import * as analyticsService from "../services/analytics.service";
import { AuthenticatedRequest } from "../types";
import { GetSummaryQuery } from "../schemas/analytics.schema";

export async function getTopCategories(
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction,
) {
	try {
		const query = req.query as unknown as GetSummaryQuery;
		const topCategories = await analyticsService.getTopCategories(
			req.user!.id,
			query,
		);

		res.status(200).json({
			status: "success",
			data: { top_categories: topCategories },
		});
	} catch (err) {
		next(err);
	}
}

export async function getSummary(
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction,
) {
	try {
		const query = req.query as unknown as GetSummaryQuery;
		const summary = await analyticsService.getSummary(req.user!.id, query);

		res.status(200).json({
			status: "success",
			data: summary,
		});
	} catch (err) {
		next(err);
	}
}

export async function getCategoryDeviation(
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction,
) {
	try {
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
