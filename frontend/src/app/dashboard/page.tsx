"use client";

import { useQuery } from "@tanstack/react-query";
import { api, ApiResponse } from "@/lib/axios";
import { SummaryData } from "@/types/analytics";
import AuthGuard from "@/components/auth/auth-guard";
import StatsCard from "@/components/dashboard/stats-card";

export default function DashboardPage() {
	const { data, isLoading } = useQuery({
		queryKey: ["summary", 3, 2026],
		queryFn: async () => {
			const res = await api.get<ApiResponse<SummaryData>>(
				"/analytics/summary?month=3&year=2026",
			);
			return res.data.data;
		},
	});

	if (isLoading) return <div className="p-8">Loading Summary...</div>;

	const summary = data;

	return (
		<AuthGuard>
			<div className="max-w-6xl space-y-8">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Overview</h1>
					<p className="text-gray-500">
						Your financial performance this month.
					</p>
				</div>

				{/* 3 Summary Cards */}
				<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
					<StatsCard
						title="Total Income"
						amount={summary?.current.income || 0}
						growth={summary?.analysis.income_growth}
						type="income"
					/>
					<StatsCard
						title="Total Expense"
						amount={summary?.current.expense || 0}
						growth={summary?.analysis.expense_growth}
						type="expense"
					/>
					<StatsCard
						title="Net Balance"
						amount={summary?.current.balance || 0}
					/>
				</div>

				{/* Space buat Chart nanti di Phase 4.3 */}
				<div className="h-64 w-full rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 border-dashed">
					Chart Visualisation Area (Coming Soon)
				</div>
			</div>
		</AuthGuard>
	);
}
