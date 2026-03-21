export interface User {
	id: string;
	name: string;
	username: string;
	email: string;
}

export interface AuthResponse {
	token: string;
	user: User;
}

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
