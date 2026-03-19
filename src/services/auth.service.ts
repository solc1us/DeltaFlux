import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma";
import { signToken } from "../utils/jwt.util";
import { AppError } from "../utils/app.error";

// Sesuai roadmap Phase 1 - Authentication Layer
const SALT_ROUNDS = 12;

export interface RegisterInput {
	name: string;
	username: string;
	email: string;
	password: string;
}

export interface LoginInput {
	username: string;
	password: string;
}

export interface AuthResult {
	token: string;
	user: {
		id: string;
		username: string;
		name: string;
		email: string;
	};
}

/**
 * RegisterUser: Menangani pendaftaran user baru di DeltaFlux.
 * Menggunakan status code 409 untuk konflik email.
 */
export async function registerUser(input: RegisterInput): Promise<AuthResult> {
	const existing = await prisma.user.findFirst({
		where: { OR: [{ email: input.email }, { username: input.username }] },
	});

	if (existing) {
		const message =
			existing.email === input.email
				? "Email already in use"
				: "Username already in use";
		throw new AppError(409, message);
	}

	// Hashing password sebelum simpan ke DB
	const password_hash = await bcrypt.hash(input.password, SALT_ROUNDS);

	const user = await prisma.user.create({
		data: {
			name: input.name,
			email: input.email,
			username: input.username,
			passwordHash: password_hash,
		},
		select: { id: true, email: true, name: true, username: true },
	});

	// Generate JWT Token
	const token = signToken({
		id: user.id,
		email: user.email,
		name: user.name,
		username: user.username,
	});

	return { user, token };
}

/**
 * LoginUser: Menangani autentikasi user DeltaFlux.
 * Menggunakan status code 401 untuk kredensial tidak valid.
 */
export async function loginUser(input: LoginInput): Promise<AuthResult> {
	const user = await prisma.user.findUnique({
		where: { username: input.username },
	});

	if (!user) {
		throw new AppError(401, "Invalid username or password");
	}

	const valid = await bcrypt.compare(input.password, user.passwordHash);
	if (!valid) {
		throw new AppError(401, "Invalid username or password");
	}

	const token = signToken({
		id: user.id,
		email: user.email,
		name: user.name,
		username: user.username,
	});

	return {
		token,
		user: {
			id: user.id,
			email: user.email,
			name: user.name,
			username: user.username,
		},
	};
}
