import { Response, NextFunction } from "express";
import * as analyticsService from "../services/analytics.service";
import { AuthenticatedRequest } from "../types";
import { GetSummaryQuery } from "../schemas/dashboard.schema";

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
