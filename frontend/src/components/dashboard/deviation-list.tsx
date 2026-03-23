"use client";

import {
	AlertTriangle,
	ArrowUpRight,
	ArrowDownRight,
	Minus,
} from "lucide-react";
import { clsx } from "clsx";
import { CategoryDeviation } from "@/types/analytics";

interface Props {
	deviations: CategoryDeviation[];
}

export default function DeviationList({ deviations }: Props) {
	const formatCurrency = (val: number) =>
		new Intl.NumberFormat("id-ID", {
			style: "currency",
			currency: "IDR",
			minimumFractionDigits: 0,
		}).format(val);

	return (
		<div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
			<div className="mb-6 flex items-center justify-between">
				<h3 className="text-lg font-bold text-gray-900">
					Category Deviations (MoM)
				</h3>
				<span className="rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-500">
					Monthly Variance
				</span>
			</div>

			<div className="space-y-4">
				{deviations.map((item) => {
					const isGrowing = (item.momPercentage ?? 0) > 0;

					return (
						<div
							key={item.categoryId}
							className="flex items-center justify-between rounded-xl border border-transparent p-2 transition-all hover:bg-gray-50"
						>
							<div className="flex items-center gap-3">
								<div
									className={clsx(
										"flex h-10 w-10 items-center justify-center rounded-full",
										item.isSignificant
											? "bg-red-50 text-red-600"
											: "bg-gray-50 text-gray-400",
									)}
								>
									{item.isSignificant ? (
										<AlertTriangle className="h-5 w-5" />
									) : (
										<Minus className="h-5 w-5" />
									)}
								</div>
								<div>
									<p className="text-sm font-bold text-gray-900">
										{item.categoryName}
									</p>
									<p className="text-xs text-gray-500">
										{formatCurrency(item.currentTotal)}
									</p>
								</div>
							</div>

							<div className="text-right">
								{item.momPercentage !== null ? (
									<div
										className={clsx(
											"flex items-center justify-end gap-1 text-sm font-bold",
											isGrowing ? "text-red-600" : "text-green-600",
										)}
									>
										{isGrowing ? (
											<ArrowUpRight className="h-4 w-4" />
										) : (
											<ArrowDownRight className="h-4 w-4" />
										)}
										{Math.abs(item.momPercentage)}%
									</div>
								) : (
									<span className="text-xs text-gray-400">New Category</span>
								)}
								<p className="text-[10px] text-gray-400 italic">
									vs Prev: {formatCurrency(item.previousTotal)}
								</p>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
