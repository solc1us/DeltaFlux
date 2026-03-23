import { Router } from "express";
import * as transactionController from "../controllers/transaction.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import {
	createTransactionSchema,
	getTransactionsSchema,
	updateTransactionSchema,
} from "../schemas/transaction.schema";

const router = Router();

router.use(authMiddleware); // Semua route di sini butuh auth

/**
 * @route   POST /api/transactions
 * @desc    Create a new transaction
 */
router.post(
	"/",
	validate(createTransactionSchema),
	transactionController.create,
);

/**
 * @route   GET /api/transactions
 * @desc    Get all transactions for the logged-in user
 */
router.get("/", validate(getTransactionsSchema), transactionController.getAll);

/**
 * @route   GET /api/transactions/:id
 * @desc    Get single transaction by ID
 */
router.get("/:id", transactionController.getById);

/**
 * @route   PATCH /api/transactions/:id
 * @desc    Partial update transaction
 */
router.patch(
	"/:id",
	validate(updateTransactionSchema),
	transactionController.update,
);

/**
 * @route   DELETE /api/transactions/:id
 * @desc    Delete transaction
 */
router.delete("/:id", transactionController.remove);

export default router;
