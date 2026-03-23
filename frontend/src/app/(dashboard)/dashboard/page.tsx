"use client";

import { useQuery } from "@tanstack/react-query";
import { api, ApiResponse } from "@/lib/axios";
import { DeviationResponse, SummaryData } from "@/types/analytics"; // Import interface yang udah kita buat
import AuthGuard from "@/components/auth/auth-guard";
import StatsCard from "@/components/dashboard/stats-card";
import DeviationList from "@/components/dashboard/deviation-list";
import dynamic from "next/dynamic";

const ExpenseChart = dynamic(
	() => import("@/components/dashboard/expense-chart"),
	{
		ssr: false,
		loading: () => (
			<div className="h-[350px] w-full animate-pulse bg-gray-50 rounded-2xl" />
		),
	},
);

export default function DashboardPage() {
	// 1. Gunakan Generic Type pada api.get dan useQuery
	// Query 1: Summary Stats
	const { data: summaryData, isLoading: isSummaryLoading } = useQuery({
		queryKey: ["summary", 3, 2026],
		queryFn: async () => {
			const res = await api.get<ApiResponse<SummaryData>>(
				"/analytics/summary?month=3&year=2026",
			);
			return res.data.data;
		},
	});

	// Query 2: Category Deviation (Real Data, No Mock)
	const { data: deviationData, isLoading: isDeviationLoading } = useQuery({
		queryKey: ["deviations", 3, 2026],
		queryFn: async () => {
			const res = await api.get<ApiResponse<DeviationResponse>>(
				"/analytics/category-deviation?month=3&year=2026",
			);
			return res.data.data;
		},
	});

	if (isSummaryLoading || isDeviationLoading) {
		return (
			<div className="p-8 text-gray-400 animate-pulse font-medium">
				Analyzing deviations...
			</div>
		);
	}

	return (
		<AuthGuard>
			<div className="max-w-6xl space-y-8">
				<header>
					<h1 className="text-3xl font-bold tracking-tight text-gray-900">
						Overview
					</h1>
					<p className="text-gray-500">March 2026 Financial Insight.</p>
				</header>

				{/* Stats Section */}
				<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
					<StatsCard
						title="Total Income"
						amount={summaryData?.current.income ?? 0}
						growth={summaryData?.analysis.income_growth}
						type="income"
					/>
					<StatsCard
						title="Total Expense"
						amount={summaryData?.current.expense ?? 0}
						growth={summaryData?.analysis.expense_growth}
						type="expense"
					/>
					<StatsCard
						title="Net Balance"
						amount={summaryData?.current.balance ?? 0}
					/>
				</div>

				{/* Analytics Section */}
				<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
					<div className="lg:col-span-2">
						<ExpenseChart data={[]} /> {/* Sementara kosong sampai Phase 5 */}
					</div>
					<div className="lg:col-span-1">
						{/* Kirim data asli dari API ke komponen */}
						<DeviationList deviations={deviationData?.deviations ?? []} />
					</div>
				</div>
			</div>
		</AuthGuard>
	);
}
