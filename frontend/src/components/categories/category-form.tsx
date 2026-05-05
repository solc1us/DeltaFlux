"use client";

import { useForm, useWatch } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { X } from "lucide-react";
import { Category, CreateCategoryInput } from "@/types/category";
import { useEffect } from "react";
import { toast } from "sonner";
import { clsx } from "clsx";

interface CategoryFormProps {
	onClose: () => void;
	initialData?: Category; // Tanda tanya (?) berarti boleh kosong (pas Add New)
}

// 2. PASTIIN destrukturisasinya nangkep { onClose, initialData }
export default function CategoryForm({
	onClose,
	initialData,
}: CategoryFormProps) {
	const queryClient = useQueryClient();
	const isEdit = !!initialData;

	const {
		register,
		handleSubmit,
		reset,
		control,
		formState: { errors },
	} = useForm<CreateCategoryInput>({
		defaultValues: {
			name: initialData?.name || "",
			type: initialData?.type || "expense",
		},
	});

	const currentType = useWatch({
		control,
		name: "type",
		defaultValue: initialData?.type || "expense",
	});

	// Reset form pas data berubah (penting buat mode edit)
	useEffect(() => {
		if (initialData) {
			reset({
				name: initialData.name,
				type: initialData.type,
			});
		} else {
			reset({
				name: "",
				type: "expense",
			});
		}
	}, [initialData, reset]);

	const mutation = useMutation({
		mutationFn: (data: CreateCategoryInput) => {
			return isEdit
				? api.patch(`/categories/${initialData.id}`, data)
				: api.post("/categories", data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["categories"] });
			toast.success("Category updated"); // Jauh lebih clean daripada alert()
			onClose();
		},
		onError: () => {
			toast.error("Error saving category");
		},
	});

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
			<div className="w-full max-w-md rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-8 shadow-2xl shadow-black/40">
				<div className="flex items-center justify-between mb-6">
					<h2 className="text-xl font-bold tracking-tight text-zinc-100">
						{isEdit ? "Edit Category" : "New Category"}
					</h2>
					<button
						type="button"
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
					{/* Toggle Type Container */}
					<div
						className={clsx(
							"grid grid-cols-2 gap-2 rounded-xl p-1.5 transition-colors duration-300",
							currentType === "income" ? "bg-emerald-500/5" : "bg-rose-500/5",
						)}
					>
						{(["income", "expense"] as const).map((t) => (
							<label
								key={t}
								className={clsx(
									"relative cursor-pointer",
									isEdit && "cursor-not-allowed opacity-60", // Visual feedback kalau disabled
								)}
							>
								<input
									type="radio"
									value={t}
									{...register("type")}
									disabled={isEdit} // Strict: Lock value pas Edit mode
									className="peer hidden"
								/>
								<div
									className={clsx(
										"relative z-10 rounded-lg py-2.5 text-center text-[10px] font-bold uppercase tracking-widest transition-all duration-300",
										"text-zinc-500 hover:text-zinc-300",
										// Custom peer-checked styles based on type
										t === "income"
											? "peer-checked:bg-emerald-500/10 peer-checked:text-emerald-400 peer-checked:shadow-[inset_0_0_0_1px_rgba(16,185,129,0.2)]"
											: "peer-checked:bg-rose-500/10 peer-checked:text-rose-400 peer-checked:shadow-[inset_0_0_0_1px_rgba(244,63,94,0.2)]",
									)}
								>
									{t}
								</div>
							</label>
						))}
					</div>

					<div>
						<input
							type="text"
							placeholder="Category Name"
							{...register("name", { required: "Name is required" })}
							className="w-full rounded-lg border border-zinc-800/60 bg-zinc-950/50 p-4 text-sm text-zinc-100 outline-none transition-all placeholder:text-zinc-500 focus:border-zinc-700"
						/>
						{errors.name && (
							<p className="mt-1 text-xs text-rose-400">
								{errors.name.message}
							</p>
						)}
					</div>

					<button
						type="submit"
						disabled={mutation.isPending}
						className="w-full rounded-lg border border-zinc-700 bg-zinc-100 py-3.5 font-bold text-zinc-900 transition-all hover:bg-zinc-200 hover:scale-[1.02] active:scale-[0.98] disabled:border-zinc-800 disabled:bg-zinc-700 disabled:text-zinc-400 "
					>
						{mutation.isPending
							? "Processing..."
							: isEdit
								? "Save Changes"
								: "Confirm Category"}
					</button>
				</form>
			</div>
		</div>
	);
}
