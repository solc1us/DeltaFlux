"use client";

import { useForm, useWatch } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, ApiResponse } from "@/lib/axios";
import { X } from "lucide-react";
import { Category, CreateTransactionInput } from "@/types/transaction"; // Re-use interface tadi
import { clsx } from "clsx";

// Taruh di dalam komponen TransactionForm
const today = new Date().toISOString().split("T")[0];

interface CategoryResponse {
	categories: (Category & { id: string })[];
}

export default function TransactionForm({ onClose }: { onClose: () => void }) {
	const queryClient = useQueryClient();

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
		control,
	} = useForm<CreateTransactionInput>({
		defaultValues: {
			type: "expense",
			transaction_date: new Date().toISOString().split("T")[0],
		},
	});

	// Watch nilai 'type' buat filter kategori secara real-time
	const selectedType = useWatch({ control, name: "type" });

	// 1. Fetch Categories
	const { data: catData, isLoading: catLoading } = useQuery({
		queryKey: ["categories"],
		queryFn: async () => {
			const res = await api.get<ApiResponse<CategoryResponse>>("/categories");
			return res.data.data;
		},
	});

	// 2. Filter kategori sesuai tipe yang dipilih (Rigor Check)
	const filteredCategories =
		catData?.categories.filter((c) => c.type === selectedType) || [];

	const mutation = useMutation({
		mutationFn: (data: CreateTransactionInput) => {
			const payload = {
				...data,
				transaction_date: new Date(data.transaction_date).toISOString(), // Sesuaikan dengan backend
			};
			return api.post("/transactions", payload);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["transactions"] });
			onClose();
			reset();
		},
	});

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
			<div className="w-full max-w-md rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-8 shadow-2xl shadow-black/40">
				<div className="flex items-center justify-between mb-6">
					<h2 className="text-xl font-bold tracking-tight text-zinc-100">
						New Transaction
					</h2>
					<button
						onClick={onClose}
						className="text-zinc-500 transition-colors hover:text-zinc-200"
					>
						<X className="w-5 h-5" />
					</button>
				</div>

				<form
					onSubmit={handleSubmit((data) => mutation.mutate(data))}
					className="space-y-4"
				>
					{/* Toggle Type */}
					<div className="grid grid-cols-2 gap-2 rounded-lg border border-zinc-800/60 bg-zinc-950/50 p-1">
						{["income", "expense"].map((t) => (
							<label key={t} className="cursor-pointer">
								<input
									type="radio"
									value={t}
									{...register("type")}
									className="peer hidden"
								/>
								<div className="rounded-md py-2 text-center text-sm font-semibold capitalize text-zinc-500 transition-all peer-checked:bg-zinc-800 peer-checked:text-zinc-100 peer-checked:shadow-lg peer-checked:shadow-black/20">
									{t}
								</div>
							</label>
						))}
					</div>

					{/* Amount */}
					<input
						type="number"
						placeholder="0"
						{...register("amount", { required: true, valueAsNumber: true })}
						className="w-full rounded-lg border border-zinc-800/60 bg-zinc-950/50 p-3 text-lg font-bold text-zinc-100 outline-none transition-all placeholder:text-zinc-500 focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700"
					/>

					{/* Dropdown Category */}
					<select
						{...register("category_id", { required: true })}
						className="w-full rounded-lg border border-zinc-800/60 bg-zinc-950/50 p-3 text-sm text-zinc-100 outline-none focus:border-zinc-700"
						disabled={catLoading}
					>
						<option value="">Select Category</option>
						{filteredCategories.map((cat) => (
							<option key={cat.id} value={cat.id}>
								{cat.name}
							</option>
						))}
					</select>

					{/* Source & Date */}
					<div className="grid grid-cols-2 gap-3">
						<input
							type="text"
							placeholder="Source (e.g. Bank)"
							{...register("source", { required: true })}
							className="rounded-lg border border-zinc-800/60 bg-zinc-950/50 p-2.5 text-sm text-zinc-100 outline-none placeholder:text-zinc-500 focus:border-zinc-700"
						/>

						<input
							type="date"
							max={today} // Mencegah pilih tanggal di masa depan lewat UI kalender
							{...register("transaction_date", {
								required: "Date is required",
								validate: (value) =>
									value <= today || "Date cannot be in the future", // Hard validation logic
							})}
							className={clsx(
								"rounded-lg border border-zinc-800/60 bg-zinc-950/50 p-2.5 text-sm text-zinc-100 outline-none focus:border-zinc-700",
								errors.transaction_date && "border-rose-500", // Visual cue kalau error
							)}
						/>
						{errors.transaction_date && (
							<span className="mt-1 text-[10px] uppercase tracking-widest text-rose-400">
								{errors.transaction_date.message}
							</span>
						)}
					</div>

					<input
						type="text"
						placeholder="Description"
						{...register("description")}
						className="w-full rounded-lg border border-zinc-800/60 bg-zinc-950/50 p-3 text-sm text-zinc-100 outline-none placeholder:text-zinc-500 focus:border-zinc-700"
					/>

					<button
						disabled={mutation.isPending || catLoading}
						className="w-full rounded-lg border border-zinc-700 bg-zinc-100 py-3.5 font-bold text-zinc-900 transition-all hover:bg-zinc-200 disabled:border-zinc-800 disabled:bg-zinc-700 disabled:text-zinc-400"
					>
						{mutation.isPending ? "Processing..." : "Confirm Transaction"}
					</button>
				</form>
			</div>
		</div>
	);
}
