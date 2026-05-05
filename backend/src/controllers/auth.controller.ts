import { Request, Response, NextFunction } from "express";
import * as authService from "../services/auth.service";
import * as categoryService from "../services/category.service";

const DEFAULT_CATEGORIES = [
	{ name: "Gaji", type: "income" },
	{ name: "Makanan", type: "expense" },
	{ name: "Transportasi", type: "expense" },
	{ name: "Hiburan", type: "expense" },
	{ name: "Belanja", type: "expense" },
] as const;

/**
 * Handle Registrasi User DeltaFlux
 * Route: POST /api/auth/register
 */
export async function register(
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> {
	try {
		// Destructuring username juga dari body
		const { name, username, email, password } = req.body;

		// 1. Register User (Dapet userId dari sini)
		const result = await authService.registerUser({
			name,
			username,
			email,
			password,
		});

		// result.user.id atau result.id, sesuaikan dengan return authService lo
		const newUserId = result.user?.id;

		// 2. Seed Default Categories via CategoryService
		// Kita looping dan tembak service satu per satu sesuai arsitektur lo
		if (newUserId) {
			try {
				await Promise.all(
					DEFAULT_CATEGORIES.map((category) => {
						// Pastikan variabel 'input' ini tipenya CreateCategoryInput
						return categoryService.createCategory(newUserId, {
							name: category.name,
							type: category.type as "income" | "expense",
						});
					}),
				);
			} catch (seedError) {
				// Kita log error-nya tapi jangan gagalin register user-nya
				// biar user tetep bisa masuk, meski kategori gagal di-seed (opsional)
				console.error("Seeding categories failed:", seedError);
			}
		}

		res.status(201).json({
			status: "success",
			message: "User registered successfully",
			data: result,
		});
	} catch (err) {
		next(err);
	}
}

/**
 * Handle Login User DeltaFlux
 * Route: POST /api/auth/login
 */
export async function login(
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> {
	try {
		const { username, password } = req.body;

		const result = await authService.loginUser({ username, password });

		res.status(200).json({
			status: "success",
			message: "Login successful",
			data: result,
		});
	} catch (err) {
		next(err);
	}
}
