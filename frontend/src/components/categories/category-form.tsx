"use client";

import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { X } from "lucide-react";
import { CreateCategoryInput } from "@/types/category";

export default function CategoryForm({ onClose }: { onClose: () => void }) {
	const queryClient = useQueryClient();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<CreateCategoryInput>({
		defaultValues: {
			type: "expense",
		},
	});

	const mutation = useMutation({
		mutationFn: (data: CreateCategoryInput) => api.post("/categories", data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["categories"] });
			onClose();
		},
	});

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
			<div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl ring-1 ring-black/5">
				<div className="flex items-center justify-between mb-6">
					<h2 className="text-xl font-bold text-gray-900">New Category</h2>
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

					{/* Name Input */}
					<div>
						<input
							type="text"
							placeholder="Category Name (e.g. Gaji)"
							{...register("name", { required: "Name is required" })}
							className="w-full rounded-lg border border-gray-200 p-3 text-sm focus:border-black outline-none transition-all"
						/>
						{errors.name && (
							<p className="text-[10px] text-red-500 mt-1">
								{errors.name.message}
							</p>
						)}
					</div>

					<button
						disabled={mutation.isPending}
						className="w-full rounded-lg bg-black py-3.5 font-bold text-white hover:bg-gray-800 disabled:bg-gray-400 transition-all shadow-lg shadow-black/10"
					>
						{mutation.isPending ? "Adding..." : "Confirm Category"}
					</button>
				</form>
			</div>
		</div>
	);
}
