import { Response, NextFunction } from "express";
import * as dashboardService from "../services/dashboard.service";
import { AuthenticatedRequest } from "../types";
import { GetSummaryQuery } from "../schemas/dashboard.schema";

export async function getSummary(
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction,
) {
	try {
		const query = req.query as unknown as GetSummaryQuery;
		const summary = await dashboardService.getSummary(req.user!.id, query);

		res.status(200).json({
			status: "success",
			data: summary,
		});
	} catch (err) {
		next(err);
	}
}
