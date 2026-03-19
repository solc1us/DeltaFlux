import { Router } from "express";
import * as transactionController from "../controllers/transaction.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { createTransactionSchema } from "../schemas/transaction.schema";

const router = Router();

/**
 * Route: POST /api/transactions/
 * Desc: Create new transaction (Income/Expense)
 * Access: Private
 */
router.post(
	"/",
	authMiddleware, // Cast biar Express gak bawel
	validate(createTransactionSchema),
	transactionController.create, // Cast di sini juga
);

router.get("/", transactionController.getAll);
router.get("/:id", transactionController.getById);
router.patch("/:id", transactionController.update);
router.delete("/:id", transactionController.remove);

export default router;
