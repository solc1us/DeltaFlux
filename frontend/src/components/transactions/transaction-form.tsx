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
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
			<div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl ring-1 ring-black/5">
				<div className="flex items-center justify-between mb-6">
					<h2 className="text-xl font-bold text-gray-900">New Transaction</h2>
					<button
						onClick={onClose}
						className="text-gray-400 hover:text-gray-600 transition-colors"
					>
						<X className="w-5 h-5" />
					</button>
				</div>

				<form
					onSubmit={handleSubmit((data) => mutation.mutate(data))}
					className="space-y-4"
				>
					{/* Toggle Type */}
					<div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-lg">
						{["income", "expense"].map((t) => (
							<label key={t} className="cursor-pointer">
								<input
									type="radio"
									value={t}
									{...register("type")}
									className="peer hidden"
								/>
								<div className="text-center py-2 text-sm font-semibold rounded-md peer-checked:bg-white peer-checked:text-black peer-checked:shadow-sm text-gray-500 capitalize transition-all">
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
						className="w-full rounded-lg border border-gray-200 p-3 text-lg font-bold focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
					/>

					{/* Dropdown Category */}
					<select
						{...register("category_id", { required: true })}
						className="w-full rounded-lg border border-gray-200 p-3 text-sm focus:border-black outline-none bg-white"
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
							className="rounded-lg border border-gray-200 p-2.5 text-sm focus:border-black outline-none"
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
								"rounded-lg border border-gray-200 p-2.5 text-sm focus:border-black outline-none",
								errors.transaction_date && "border-red-500", // Visual cue kalau error
							)}
						/>
						{errors.transaction_date && (
							<span className="text-[10px] text-red-500 mt-1">
								{errors.transaction_date.message}
							</span>
						)}
					</div>

					<input
						type="text"
						placeholder="Description"
						{...register("description")}
						className="w-full rounded-lg border border-gray-200 p-3 text-sm focus:border-black outline-none"
					/>

					<button
						disabled={mutation.isPending || catLoading}
						className="w-full rounded-lg bg-black py-3.5 font-bold text-white hover:bg-gray-800 disabled:bg-gray-400 transition-all shadow-lg shadow-black/10"
					>
						{mutation.isPending ? "Processing..." : "Confirm Transaction"}
					</button>
				</form>
			</div>
		</div>
	);
}
