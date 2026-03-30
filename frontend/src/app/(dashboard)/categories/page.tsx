"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, ApiResponse } from "@/lib/axios";
import { Category } from "@/types/category";
import AuthGuard from "@/components/auth/auth-guard";
import { Plus, Pencil, Trash2 } from "lucide-react";
import CategoryForm from "@/components/categories/category-form";

interface CategoryResponse {
	categories: Category[];
}

export default function CategoryPage() {
	const [isModalOpen, setIsModalOpen] = useState(false);
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
		},
		onError: () => {
			alert("Failed to delete category");
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

	const handleDelete = (id: string) => {
		if (confirm("Are you sure you want to delete this category?")) {
			deleteMutation.mutate(id);
		}
	};

	return (
		<AuthGuard>
			<div className="space-y-8">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold tracking-tight">Categories</h1>
						<p className="text-gray-500">
							Manage your income and expense labels.
						</p>
					</div>
					<button
						onClick={() => setIsModalOpen(true)}
						className="flex items-center gap-2 rounded-lg bg-black px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 transition-all shadow-sm"
					>
						<Plus className="w-4 h-4" />
						Add Category
					</button>
				</div>

				{isLoading ? (
					<div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-gray-200 bg-white">
						<p className="text-sm text-gray-400 animate-pulse">
							Fetching records...
						</p>
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
						{data?.categories.map((cat) => (
							<div
								key={cat.id}
								className="group bg-white border border-gray-100 p-5 rounded-2xl shadow-sm hover:ring-1 hover:ring-black/5 transition-all"
							>
								<div className="flex items-center justify-between">
									<span
										className={`text-[10px] font-black uppercase tracking-[0.15em] px-2 py-1 rounded ${
											cat.type === "income"
												? "bg-emerald-50 text-emerald-600"
												: "bg-rose-50 text-rose-600"
										}`}
									>
										{cat.type}
									</span>

									<div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
										<button
											onClick={() => handleEdit(cat)}
											className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
										>
											<Pencil className="w-4 h-4" />
										</button>
										<button
											onClick={() => handleDelete(cat.id)}
											className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
										>
											<Trash2 className="w-4 h-4" />
										</button>
									</div>
								</div>

								<div className="mt-4">
									<h3 className="text-lg font-bold text-gray-900 leading-tight">
										{cat.name}
									</h3>
									<p className="text-[10px] text-gray-400 mt-1 uppercase tracking-tighter">
										Last updated {new Date(cat.updatedAt).toLocaleDateString()}
									</p>
								</div>
							</div>
						))}
					</div>
				)}

				{isModalOpen && (
					<CategoryForm
						onClose={handleCloseModal}
						initialData={editingCategory ?? undefined}
					/>
				)}
			</div>
		</AuthGuard>
	);
}
