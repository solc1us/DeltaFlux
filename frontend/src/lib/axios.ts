import axios from "axios";

export const api = axios.create({
	// Kita pake variable env biar gak hardcoded
	baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
	headers: {
		"Content-Type": "application/json",
	},
});

// Interceptor: Otomatis nambahin Token ke tiap request kalau ada di localStorage
api.interceptors.request.use((config) => {
	if (typeof window !== "undefined") {
		const token = localStorage.getItem("token");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
	}
	return config;
});
