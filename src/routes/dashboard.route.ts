import { Router } from "express";
import * as dashboardController from "../controllers/dashboard.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { getSummarySchema } from "../schemas/dashboard.schema";

const router = Router();

router.use(authMiddleware);

router.get(
	"/top-categories",
	validate(getSummarySchema),
	dashboardController.getTopCategories,
);

router.get(
	"/summary",
	validate(getSummarySchema),
	dashboardController.getSummary,
);

export default router;
