"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api, ApiResponse } from "@/lib/axios";
import { TransactionResponse } from "@/types/transaction";
import AuthGuard from "@/components/auth/auth-guard";
import TransactionTable from "@/components/transactions/transaction-table";
import { Plus } from "lucide-react";
import TransactionForm from "@/components/transactions/transaction-form";

export default function TransactionPage() {
	const [isModalOpen, setIsModalOpen] = useState(false);

	const { data, isLoading } = useQuery({
		queryKey: ["transactions", 3, 2026],
		queryFn: async () => {
			const response = await api.get<ApiResponse<TransactionResponse>>(
				"/transactions?month=3&year=2026",
			);
			return response.data.data;
		},
	});

	return (
		<AuthGuard>
			<main className="min-h-screen bg-gray-50 p-8">
				<div className="mx-auto max-w-5xl">
					{/* 1. Header Section */}
					<header className="mb-8 flex items-center justify-between">
						<div>
							<h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
							<p className="text-sm text-gray-500">March 2026 Analysis</p>
						</div>
						<button
							onClick={() => setIsModalOpen(true)}
							className="flex rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
						>
							<Plus className="w-4 h-4" />
							Add Transaction
						</button>
					</header>

					{/* 2. Table Section */}
					{isLoading ? (
						<div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-gray-200 bg-white">
							<p className="text-sm text-gray-400 animate-pulse">
								Fetching records...
							</p>
						</div>
					) : (
						<TransactionTable transactions={data?.transactions || []} />
					)}

					{/* 3. Modal Form (Akan kita buat di bawah) */}
					{isModalOpen && (
						<TransactionForm onClose={() => setIsModalOpen(false)} />
					)}
				</div>
			</main>
		</AuthGuard>
	);
}
