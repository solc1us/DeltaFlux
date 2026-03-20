import { Response, NextFunction } from "express";
import * as transactionService from "../services/transaction.service";
import { AuthenticatedRequest } from "../types"; // Import interface custom
import { GetTransactionsQuery } from "src/schemas/transaction.schema";

export async function create(
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction,
): Promise<void> {
	try {
		const userId = req.user!.id;

		if (!userId) {
			res.status(401).json({ status: "error", message: "Unauthorized" });
			return;
		}

		const transaction = await transactionService.createTransaction(
			userId,
			req.body,
		);

		res.status(201).json({
			status: "success",
			data: { transaction },
		});
	} catch (err) {
		next(err);
	}
}

export async function getAll(
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction,
) {
	try {
		// Zod bakal handle: kalo kosong ya {} , kalo ada ya divalidasi
		const query = req.query as unknown as GetTransactionsQuery;
		const transactions = await transactionService.getAllTransactions(
			req.user!.id,
			query,
		);

		res.status(200).json({
			status: "success",
			results: transactions.length,
			data: { transactions },
		});
	} catch (err) {
		next(err);
	}
}

export async function getById(
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction,
) {
	try {
		const { id } = req.params as { id: string };
		const transaction = await transactionService.getTransactionById(
			req.user!.id,
			id,
		);
		res.status(200).json({ status: "success", data: { transaction } });
	} catch (err) {
		next(err);
	}
}

export async function update(
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction,
) {
	try {
		const user = req.user!;
		const { id } = req.params as { id: string };
		const transaction = await transactionService.updateTransaction(
			user.id,
			id,
			req.body,
		);
		res.status(200).json({ status: "success", data: { transaction } });
	} catch (err) {
		next(err);
	}
}

export async function remove(
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction,
) {
	try {
		const user = req.user!;
		const { id } = req.params as { id: string };
		await transactionService.deleteTransaction(user.id, id);
		res.status(204).send(); // No Content
	} catch (err) {
		next(err);
	}
}
