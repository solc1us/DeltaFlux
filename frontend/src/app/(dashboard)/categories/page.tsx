"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api, ApiResponse } from "@/lib/axios";
import { Category } from "@/types/category";
import AuthGuard from "@/components/auth/auth-guard";
import { Plus, Tag } from "lucide-react";
import CategoryForm from "@/components/categories/category-form";

interface CategoryResponse {
	categories: Category[];
}

export default function CategoryPage() {
	const [isModalOpen, setIsModalOpen] = useState(false);

	const { data, isLoading } = useQuery({
		queryKey: ["categories"],
		queryFn: async () => {
			const response =
				await api.get<ApiResponse<CategoryResponse>>("/categories");
			return response.data.data;
		},
	});

	return (
		<AuthGuard>
			<div className="space-y-8">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold tracking-tight">Categories</h1>
						<p className="text-gray-500">
							Classification for your transactions.
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
							Fetching categories...
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
									<div className="p-2 bg-gray-50 rounded-lg group-hover:bg-black group-hover:text-white transition-colors">
										<Tag className="w-5 h-5" />
									</div>
									<span
										className={`text-[10px] font-black uppercase tracking-[0.15em] px-2 py-1 rounded ${
											cat.type === "income"
												? "bg-emerald-50 text-emerald-600"
												: "bg-rose-50 text-rose-600"
										}`}
									>
										{cat.type}
									</span>
								</div>
								<div className="mt-4">
									<h3 className="text-lg font-bold text-gray-900 leading-tight">
										{cat.name}
									</h3>
									<p className="text-[10px] text-gray-400 mt-1 uppercase tracking-tighter">
										Created {new Date(cat.createdAt).toLocaleDateString()}
									</p>
								</div>
							</div>
						))}
					</div>
				)}

				{isModalOpen && <CategoryForm onClose={() => setIsModalOpen(false)} />}
			</div>
		</AuthGuard>
	);
}
