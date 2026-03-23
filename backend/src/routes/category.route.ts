import { Router } from "express";
import * as categoryController from "../controllers/category.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import {
	createCategorySchema,
	updateCategorySchema,
} from "../schemas/category.schema";

const router = Router();

// Semua endpoint kategori wajib login
router.use(authMiddleware);

/**
 * @route   POST /api/categories
 * @desc    Create a new category (Income/Expense)
 */
router.post("/", validate(createCategorySchema), categoryController.create);

/**
 * @route   GET /api/categories
 * @desc    Get all categories for the current user
 */

router.get("/", categoryController.getAll);

/**
 * @route   PATCH /api/categories/:id
 * @desc    Update category (name/type)
 */
router.patch("/:id", validate(updateCategorySchema), categoryController.update);

/**
 * @route   DELETE /api/categories/:id
 * @desc    Delete category (if no transactions attached)
 */
router.delete("/:id", categoryController.remove);

export default router;
