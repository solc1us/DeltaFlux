import { Router } from "express";
import * as analyticsController from "../controllers/analytics.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { getSummarySchema } from "../schemas/analytics.schema";

const router = Router();

router.use(authMiddleware);

router.get(
	"/top-categories",
	validate(getSummarySchema),
	analyticsController.getTopCategories,
);

router.get(
	"/summary",
	validate(getSummarySchema),
	analyticsController.getSummary,
);

router.get(
	"/category-deviation",
	validate(getSummarySchema),
	analyticsController.getCategoryDeviation,
);

export default router;
