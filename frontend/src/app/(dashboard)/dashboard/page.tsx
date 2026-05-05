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
			<div className="h-[350px] w-full animate-pulse rounded-2xl border border-zinc-800/60 bg-zinc-900/40" />
		),
	},
);

export default function DashboardPage() {
	// 1. Dapatkan bulan dan tahun saat ini
	const now = new Date();
	const currentMonth = now.getMonth() + 1; // 1-12
	const currentYear = now.getFullYear();

	// Query 1: Summary Stats
	const { data: summaryData, isLoading: isSummaryLoading } = useQuery({
		// 2. Gunakan variabel di Query Key agar reaktif
		queryKey: ["summary", currentMonth, currentYear],
		queryFn: async () => {
			// 3. Gunakan Template Literals buat inject ke URL
			const res = await api.get<ApiResponse<SummaryData>>(
				`/analytics/summary?month=${currentMonth}&year=${currentYear}`,
			);
			return res.data.data;
		},
	});

	// Query 2: Category Deviation
	const { data: deviationData, isLoading: isDeviationLoading } = useQuery({
		queryKey: ["deviations", currentMonth, currentYear],
		queryFn: async () => {
			const res = await api.get<ApiResponse<DeviationResponse>>(
				`/analytics/category-deviation?month=${currentMonth}&year=${currentYear}`,
			);
			return res.data.data;
		},
	});

	return (
		<AuthGuard>
			<div className="max-w-6xl space-y-8">
				<header>
					<h1 className="text-3xl font-bold tracking-tight text-zinc-100">
						Overview
					</h1>
					<p className="text-sm text-zinc-500">
						{now.toLocaleDateString("en-US", {
							month: "long",
							year: "numeric",
						})}{" "}
						Financial Insight.
					</p>
				</header>

				{/* Stats Section */}
				<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
					{/* Kita passing isLoading ke StatsCard */}
					<StatsCard
						title="Total Income"
						amount={summaryData?.current?.income ?? 0}
						growth={summaryData?.analysis?.income_growth}
						type="income"
						isLoading={isSummaryLoading}
					/>
					<StatsCard
						title="Total Expense"
						amount={summaryData?.current?.expense ?? 0}
						growth={summaryData?.analysis?.expense_growth}
						type="expense"
						isLoading={isSummaryLoading}
					/>
					<StatsCard
						title="Net Balance"
						amount={summaryData?.current?.balance ?? 0}
						isLoading={isSummaryLoading}
					/>
				</div>

				<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
					<div className="lg:col-span-2">
						{/* Chart loading ditangani via dynamic import di atas */}
						<ExpenseChart data={[]} />
					</div>
					<div className="lg:col-span-1">
						<DeviationList
							deviations={deviationData?.deviations ?? []}
							isLoading={isDeviationLoading} // Passing ke DeviationList
						/>
					</div>
				</div>
			</div>
		</AuthGuard>
	);
}
