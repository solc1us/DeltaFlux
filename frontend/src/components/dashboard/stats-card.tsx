// components/dashboard/stats-card.tsx
"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { clsx } from "clsx";

interface StatsCardProps {
	title: string;
	amount: number;
	growth?: number;
	type?: "income" | "expense" | "neutral";
	isLoading?: boolean;
}

// Sub-komponen Skeleton biar kodenya nggak numpuk di main function
const StatsSkeleton = () => (
	<div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-6 space-y-4">
		<div className="h-3 w-20 animate-pulse rounded-full bg-zinc-800/80" />
		<div className="flex items-center justify-between">
			<div className="h-8 w-36 animate-pulse rounded-lg bg-zinc-800" />
			<div className="h-6 w-12 animate-pulse rounded-full bg-zinc-800/60" />
		</div>
	</div>
);

export default function StatsCard({
	title,
	amount,
	growth,
	type = "neutral",
	isLoading = false, // Default false
}: StatsCardProps) {
	if (isLoading) return <StatsSkeleton />;

	const formatCurrency = (val: number) =>
		new Intl.NumberFormat("id-ID", {
			style: "currency",
			currency: "IDR",
			minimumFractionDigits: 0,
		}).format(val);

	const getGrowthStatus = () => {
		if (growth === undefined || growth === 0) return "neutral";
		if (type === "income") return growth > 0 ? "good" : "bad";
		if (type === "expense") return growth > 0 ? "bad" : "good";
		return "neutral";
	};

	const status = getGrowthStatus();
	const isPositive = growth ? growth > 0 : false;

	return (
		<div className="group rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-6 shadow-sm transition-all duration-300 hover:border-zinc-700 hover:shadow-2xl hover:shadow-black/40">
			<p className="text-[10px] font-medium uppercase tracking-widest text-zinc-500">
				{title}
			</p>

			<div className="mt-2 flex items-baseline justify-between">
				<h3 className="text-2xl font-semibold tracking-tight text-zinc-100">
					{formatCurrency(amount)}
				</h3>

				{growth !== undefined && (
					<div
						className={clsx(
							"flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold transition-colors",
							status === "good" &&
								"border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
							status === "bad" &&
								"border-rose-500/20 bg-rose-500/10 text-rose-400",
							status === "neutral" &&
								"border-zinc-700 bg-zinc-800/80 text-zinc-300",
						)}
					>
						{isPositive ? (
							<TrendingUp className="w-3 h-3" />
						) : (
							<TrendingDown className="w-3 h-3" />
						)}
						{Math.abs(growth)}%
					</div>
				)}
			</div>
		</div>
	);
}
