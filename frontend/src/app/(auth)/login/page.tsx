"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { api, ApiResponse } from "@/lib/axios";
import { LoginInput, AuthResponse } from "@/types/auth";
import Link from "next/link";
import { useState } from "react";
import { AxiosError } from "axios";
import { ApiErrorResponse } from "@/types/api"; // Re-use interface error tadi

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
			// Inject token ke instance axios biar gak perlu nunggu refresh
			api.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
			router.push("/dashboard");
		},
		onError: (err: AxiosError<ApiErrorResponse>) => {
			setError(err.response?.data?.message || "Invalid username or password");
		},
	});

	const onSubmit: SubmitHandler<LoginInput> = (data) => mutation.mutate(data);

	return (
		<main className="flex min-h-screen items-center justify-center bg-[#09090b] p-6 antialiased">
			<div className="w-full max-w-md rounded-2xl bg-zinc-900/40 p-10 shadow-2xl ring-1 ring-zinc-800/60 backdrop-blur-md">
				<div className="space-y-2">
					<h2 className="text-3xl font-bold tracking-tight text-zinc-100">
						Welcome Back
					</h2>
					<p className="text-sm text-zinc-500">
						Enter your credentials to access DeltaFlux.
					</p>
				</div>

				{error && (
					<div className="mt-6 rounded-lg border border-rose-500/20 bg-rose-500/10 p-3 text-xs font-medium text-rose-400">
						{error}
					</div>
				)}

				<form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
					<div className="space-y-1.5">
						<label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
							Username
						</label>
						<input
							{...register("username", { required: "Username is required" })}
							placeholder="marcel_dev"
							className="w-full rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-sm text-zinc-100 outline-none transition-all focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 placeholder:text-zinc-700"
						/>
						{errors.username && (
							<p className="text-[10px] text-rose-500 uppercase font-bold tracking-tighter">
								{errors.username.message}
							</p>
						)}
					</div>

					<div className="space-y-1.5">
						<label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
							Password
						</label>
						<input
							type="password"
							{...register("password", { required: "Password is required" })}
							placeholder="••••••••"
							className="w-full rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-sm text-zinc-100 outline-none transition-all focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 placeholder:text-zinc-700"
						/>
						{errors.password && (
							<p className="text-[10px] text-rose-500 uppercase font-bold tracking-tighter">
								{errors.password.message}
							</p>
						)}
					</div>

					<button
						disabled={mutation.isPending}
						className="w-full rounded-lg bg-zinc-100 py-3 text-sm font-bold text-black transition-all hover:bg-white disabled:bg-zinc-700 disabled:text-zinc-400"
					>
						{mutation.isPending ? "AUTHENTICATING..." : "LOGIN"}
					</button>
				</form>

				<p className="mt-8 text-center text-xs text-zinc-500">
					Don&apos;t have an account?{" "}
					<Link
						href="/register"
						className="font-bold text-zinc-100 underline decoration-zinc-700 underline-offset-4 hover:text-white transition-colors"
					>
						Create one
					</Link>
				</p>
			</div>
		</main>
	);
}
