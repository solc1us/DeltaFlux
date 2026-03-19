import { Response, NextFunction } from "express";
import * as categoryService from "../services/category.service";
import { AuthenticatedRequest } from "../types";

export async function create(
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction,
) {
	try {
		const category = await categoryService.createCategory(
			req.user!.id,
			req.body,
		);
		res.status(201).json({ status: "success", data: { category } });
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
		const categories = await categoryService.getAllCategories(req.user!.id);
		res.status(200).json({ status: "success", data: { categories } });
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
		const { id } = req.params as { id: string };
		const category = await categoryService.updateCategory(
			req.user!.id,
			id,
			req.body,
		);
		res.status(200).json({ status: "success", data: { category } });
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
		const { id } = req.params as { id: string };
		await categoryService.deleteCategory(req.user!.id, id);
		res.status(204).send();
	} catch (err) {
		next(err);
	}
}
