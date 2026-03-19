import { Request } from "express";
import { User } from "@prisma/client";

export interface AuthPayload {
	id: string;
	username: string;
	email: string;
	name: string;
}

// Pake ini buat pengganti Request bawaan di tempat yang butuh auth
export interface AuthenticatedRequest extends Request {
	user?: User | AuthPayload;
}
