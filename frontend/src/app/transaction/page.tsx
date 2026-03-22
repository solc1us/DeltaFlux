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
			<div className="space-y-8">
				{/* 1. Header Section */}
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
						<p className="text-gray-500">Manage and monitor your cash flow.</p>
					</div>
					<button
						onClick={() => setIsModalOpen(true)}
						className="flex items-center gap-2 rounded-lg bg-black px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 transition-all shadow-sm"
					>
						<Plus className="w-4 h-4" />
						Add Transaction
					</button>
				</div>

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
		</AuthGuard>
	);
}
