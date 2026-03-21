"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { api, ApiResponse } from "@/lib/axios";
import { LoginInput, AuthResponse } from "@/types/auth";
import Link from "next/link";
import { useState } from "react";
import { AxiosError } from "axios";

export default function LoginPage() {
	const router = useRouter();
	const [error, setError] = useState<string>("");
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginInput>();

	const mutation = useMutation({
		mutationFn: async (data: LoginInput) => {
			const response = await api.post<ApiResponse<AuthResponse>>(
				"/auth/login",
				data,
			);
			return response.data;
		},
		onSuccess: (res) => {
			localStorage.setItem("token", res.data.token);
			router.push("/dashboard");
		},
		onError: (err: AxiosError<ApiResponse<null>>) => {
			setError(err.response?.data?.message || "Invalid credentials");
		},
	});

	const onSubmit: SubmitHandler<LoginInput> = (data) => mutation.mutate(data);

	return (
		<main className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
			<div className="w-full max-w-sm rounded-xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
				<h2 className="text-2xl font-bold text-gray-900">Login</h2>
				{error && (
					<p className="mt-4 text-sm text-red-600 font-medium">{error}</p>
				)}

				<form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
					<div>
						<label className="text-sm font-medium">Username</label>
						<input
							{...register("username", { required: "Username is required" })}
							className="mt-1 w-full rounded-lg border p-2 text-sm"
						/>
					</div>
					<div>
						<label className="text-sm font-medium">Password</label>
						<input
							type="password"
							{...register("password", { required: "Password is required" })}
							className="mt-1 w-full rounded-lg border p-2 text-sm"
						/>
					</div>
					<button
						disabled={mutation.isPending}
						className="w-full rounded-lg bg-black py-2 text-white hover:bg-gray-800 disabled:bg-gray-400"
					>
						{mutation.isPending ? "Logging in..." : "Login"}
					</button>
				</form>
				<p className="mt-4 text-center text-sm">
					New here?{" "}
					<Link href="/register" className="font-bold underline">
						Register
					</Link>
				</p>
			</div>
		</main>
	);
}
