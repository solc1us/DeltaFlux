// components/dashboard/deviation-list.tsx
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
	isLoading?: boolean;
}

const ItemSkeleton = () => (
	<div className="flex items-center justify-between rounded-xl border border-zinc-800/40 p-2 animate-pulse">
		<div className="flex items-center gap-3">
			<div className="h-10 w-10 rounded-full bg-zinc-800/80" />
			<div className="space-y-2">
				<div className="h-3 w-24 rounded-full bg-zinc-800" />
				<div className="h-2 w-16 rounded-full bg-zinc-800/60" />
			</div>
		</div>
		<div className="space-y-2 text-right">
			<div className="h-3 w-12 ml-auto rounded-full bg-zinc-800" />
			<div className="h-2 w-20 ml-auto rounded-full bg-zinc-800/60" />
		</div>
	</div>
);

export default function DeviationList({
	deviations,
	isLoading = false,
}: Props) {
	const formatCurrency = (val: number) =>
		new Intl.NumberFormat("id-ID", {
			style: "currency",
			currency: "IDR",
			minimumFractionDigits: 0,
		}).format(val);

	return (
		<div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-6 shadow-sm transition-all duration-300 hover:border-zinc-700 hover:shadow-2xl hover:shadow-black/40">
			<div className="mb-6 flex items-center justify-between">
				<h3 className="text-lg font-semibold tracking-tight text-zinc-100">
					Category Deviations (MoM)
				</h3>
				<span className="rounded-full border border-zinc-700 bg-zinc-800/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
					Monthly Variance
				</span>
			</div>

			<div className="space-y-4">
				{isLoading ? (
					// Render 4 baris skeleton pas loading
					<>
						<ItemSkeleton />
						<ItemSkeleton />
						<ItemSkeleton />
						<ItemSkeleton />
					</>
				) : deviations.length > 0 ? (
					deviations.map((item) => {
						const isGrowing = (item.momPercentage ?? 0) > 0;

						return (
							<div
								key={item.categoryId}
								className="group flex items-center justify-between rounded-xl border border-zinc-800/40 p-2 transition-all hover:border-zinc-700 hover:bg-zinc-800/40"
							>
								<div className="flex items-center gap-3">
									<div
										className={clsx(
											"flex h-10 w-10 items-center justify-center rounded-full transition-colors",
											item.isSignificant
												? "border border-rose-500/20 bg-rose-500/10 text-rose-400"
												: "border border-zinc-700 bg-zinc-800/80 text-zinc-500 group-hover:border-zinc-600",
										)}
									>
										{item.isSignificant ? (
											<AlertTriangle className="h-5 w-5" />
										) : (
											<Minus className="h-5 w-5" />
										)}
									</div>
									<div>
										<p className="text-sm font-semibold tracking-tight text-zinc-100">
											{item.categoryName}
										</p>
										<p className="text-xs text-zinc-500">
											{formatCurrency(item.currentTotal)}
										</p>
									</div>
								</div>

								<div className="text-right">
									{item.momPercentage !== null ? (
										<div
											className={clsx(
												"flex items-center justify-end gap-1 text-sm font-bold",
												isGrowing ? "text-rose-400" : "text-emerald-400",
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
										<span className="text-xs text-zinc-500">New Category</span>
									)}
									<p className="text-[10px] uppercase tracking-widest text-zinc-500">
										vs Prev: {formatCurrency(item.previousTotal)}
									</p>
								</div>
							</div>
						);
					})
				) : (
					// Empty state kalau emang nggak ada data sama sekali
					<div className="py-8 text-center">
						<p className="text-xs text-zinc-600 uppercase tracking-widest font-medium">
							No deviations detected
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
