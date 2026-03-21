import axios from "axios";

// Interface standar response dari Backend DeltaFlux
export interface ApiResponse<T> {
	status: string;
	data: T;
	message?: string;
}

export const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
	headers: {
		"Content-Type": "application/json",
	},
});

api.interceptors.request.use((config) => {
	if (typeof window !== "undefined") {
		const token = localStorage.getItem("token");
		if (token && config.headers) {
			config.headers.Authorization = `Bearer ${token}`;
		}
	}
	return config;
});
