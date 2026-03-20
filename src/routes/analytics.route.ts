import { Router } from "express";
import * as analyticsController from "../controllers/analytics.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { getSummarySchema } from "../schemas/dashboard.schema";

const router = Router();

router.use(authMiddleware);

router.get(
	"/category-deviation",
	validate(getSummarySchema),
	analyticsController.getCategoryDeviation,
);

export default router;
