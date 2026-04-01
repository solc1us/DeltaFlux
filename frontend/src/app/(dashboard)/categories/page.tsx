"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, ApiResponse } from "@/lib/axios";
import { Category } from "@/types/category";
import AuthGuard from "@/components/auth/auth-guard";
import { Plus, Pencil, Trash2 } from "lucide-react";
import CategoryForm from "@/components/categories/category-form";
import { toast } from "sonner";
import ConfirmModal from "@/components/ui/confirm-modal";
import { AxiosError } from "axios";
import { ApiErrorResponse } from "@/types/api";
import { clsx } from "clsx";

interface CategoryResponse {
	categories: Category[];
}

export default function CategoryPage() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [deletingId, setDeletingId] = useState<string | null>(null);
	const [editingCategory, setEditingCategory] = useState<Category | null>(null);
	const queryClient = useQueryClient();

	const { data, isLoading } = useQuery({
		queryKey: ["categories"],
		queryFn: async () => {
			const response =
				await api.get<ApiResponse<CategoryResponse>>("/categories");
			return response.data.data;
		},
	});

	const deleteMutation = useMutation({
		mutationFn: (id: string) => api.delete(`/categories/${id}`),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["categories"] });
			setDeletingId(null);
			toast.success("Category deleted");
		},
		onError: (error: AxiosError<ApiErrorResponse>) => {
			setDeletingId(null);
			const errorMessage =
				error.response?.data.message || "Error deleting category";
			toast.error(errorMessage);
		},
	});

	const handleEdit = (category: Category) => {
		setEditingCategory(category);
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setEditingCategory(null);
	};

	return (
		<AuthGuard>
			<div className="space-y-8">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold tracking-tight text-zinc-100">
							Categories
						</h1>
						<p className="text-sm text-zinc-500">
							Manage your income and expense labels.
						</p>
					</div>
					<button
						onClick={() => setIsModalOpen(true)}
						className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-100/95 px-4 py-2.5 text-sm font-semibold text-zinc-900 transition-all hover:bg-zinc-200"
					>
						<Plus className="w-4 h-4" />
						Add Category
					</button>
				</div>

				{isLoading ? (
					<div className="flex h-64 items-center justify-center rounded-2xl border border-zinc-800/60 bg-zinc-900/40">
						<div className="space-y-2 text-center">
							<div className="mx-auto h-2 w-24 animate-pulse rounded-full bg-zinc-800" />
							<p className="text-xs uppercase tracking-widest text-zinc-500">
								Fetching records...
							</p>
						</div>
					</div>
				) : (
					<>
						{!data?.categories.length ? (
							<div className="flex h-64 items-center justify-center rounded-2xl border border-zinc-800/60 bg-zinc-900/40">
								<p className="text-[10px] uppercase tracking-widest text-zinc-500">
									No categories yet. Add your first label.
								</p>
							</div>
						) : (
							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
								{data?.categories.map((cat) => (
									<div
										key={cat.id}
										className="group rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-5 transition-all duration-300 hover:border-zinc-700 hover:shadow-2xl hover:shadow-black/40"
									>
										<div className="flex items-center justify-between">
											<span
												className={clsx(
													"rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest",
													cat.type === "income"
														? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
														: "border-rose-500/20 bg-rose-500/10 text-rose-400",
												)}
											>
												{cat.type}
											</span>

											<div className="flex gap-1.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
												<button
													onClick={() => handleEdit(cat)}
													className="rounded-lg border border-zinc-700/60 bg-zinc-800/40 p-2 text-zinc-400 backdrop-blur-sm transition-all hover:border-zinc-600 hover:bg-zinc-800/80 hover:text-zinc-100"
												>
													<Pencil className="h-4 w-4" />
												</button>
												<button
													onClick={() => setDeletingId(cat.id)}
													className="rounded-lg border border-rose-500/20 bg-rose-500/10 p-2 text-zinc-400 backdrop-blur-sm transition-all hover:border-rose-500/30 hover:text-rose-300"
												>
													<Trash2 className="h-4 w-4" />
												</button>
											</div>
										</div>

										<div className="mt-4">
											<h3 className="text-lg font-semibold tracking-tight text-zinc-100">
												{cat.name}
											</h3>
											<p className="mt-1 text-[10px] uppercase tracking-widest text-zinc-500">
												Last updated {new Date(cat.updatedAt).toLocaleDateString()}
											</p>
										</div>
									</div>
								))}
							</div>
						)}
					</>
				)}

				{isModalOpen && (
					<CategoryForm
						onClose={handleCloseModal}
						initialData={editingCategory ?? undefined}
					/>
				)}

				<ConfirmModal
					isOpen={!!deletingId}
					onClose={() => setDeletingId(null)}
					onConfirm={() => deletingId && deleteMutation.mutate(deletingId)}
					isLoading={deleteMutation.isPending}
					title="Delete Category?"
					description="Are you sure? This action cannot be undone."
					confirmText="Delete"
					variant="danger"
				/>
			</div>
		</AuthGuard>
	);
}
