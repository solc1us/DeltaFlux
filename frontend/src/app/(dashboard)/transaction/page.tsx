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
						<h1 className="text-3xl font-bold tracking-tight text-zinc-100">
							Transactions
						</h1>
						<p className="text-sm text-zinc-500">
							Manage and monitor your cash flow.
						</p>
					</div>
					<button
						onClick={() => setIsModalOpen(true)}
						className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-100/95 px-4 py-2.5 text-sm font-semibold text-zinc-900 transition-all hover:bg-zinc-200"
					>
						<Plus className="w-4 h-4" />
						Add Transaction
					</button>
				</div>

				{/* 2. Table Section */}
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
