// types/api.ts
export interface ApiErrorResponse {
	status: "error";
	message: string;
	stack?: string; // Optional, biasanya muncul di dev mode
}
