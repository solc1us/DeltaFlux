"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { clsx } from "clsx";

interface StatsCardProps {
	title: string;
	amount: number;
	growth?: number;
	type?: "income" | "expense" | "neutral";
}

export default function StatsCard({
	title,
	amount,
	growth,
	type = "neutral",
}: StatsCardProps) {
	const formatCurrency = (val: number) =>
		new Intl.NumberFormat("id-ID", {
			style: "currency",
			currency: "IDR",
			minimumFractionDigits: 0,
		}).format(val);

	// Logic Rigor: Nentuin apakah growth itu "berita bagus" atau "berita buruk"
	const getGrowthStatus = () => {
		if (growth === undefined || growth === 0) return "neutral";

		if (type === "income") {
			return growth > 0 ? "good" : "bad"; // Income naik = Good
		}

		if (type === "expense") {
			return growth > 0 ? "bad" : "good"; // Expense naik = Bad (Merah)
		}

		return "neutral";
	};

	const status = getGrowthStatus();
	const isPositive = growth ? growth > 0 : false;

	return (
		<div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
			<p className="text-sm font-medium text-gray-500">{title}</p>
			<div className="mt-2 flex items-baseline justify-between">
				<h3 className="text-2xl font-bold tracking-tight text-gray-900">
					{formatCurrency(amount)}
				</h3>

				{growth !== undefined && (
					<div
						className={clsx(
							"flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold",
							status === "good" && "bg-green-50 text-green-700",
							status === "bad" && "bg-red-50 text-red-700",
							status === "neutral" && "bg-gray-50 text-gray-700",
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
