"use client";

import { useQuery } from "@tanstack/react-query";
import { api, ApiResponse } from "@/lib/axios";
import { TransactionResponse } from "@/types/transaction";
import AuthGuard from "@/components/auth/auth-guard";
import TransactionTable from "@/components/transactions/transaction-table";

export default function DashboardPage() {
	const { data, isLoading, error } = useQuery({
		queryKey: ["transactions", 3, 2026], // Query key berdasarkan filter
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
					<h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
					<p className="text-sm text-gray-500 mb-4">Overview for March 2026</p>
				</div>
			</main>
		</AuthGuard>
	);
}
