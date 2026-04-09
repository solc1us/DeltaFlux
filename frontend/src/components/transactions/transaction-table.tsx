"use client";

import { Transaction } from "@/types/transaction";
import { clsx } from "clsx";

interface Props {
	transactions: Transaction[];
}

export default function TransactionTable({ transactions }: Props) {
	const formatCurrency = (amount: string) => {
		return new Intl.NumberFormat("id-ID", {
			style: "currency",
			currency: "IDR",
			minimumFractionDigits: 0,
		}).format(Number(amount));
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("id-ID", {
			day: "numeric",
			month: "short",
			year: "numeric",
		});
	};

	return (
		<div className="overflow-x-auto rounded-2xl border border-zinc-800/60 bg-zinc-900/40 shadow-sm transition-all duration-300 hover:border-zinc-700 hover:shadow-2xl hover:shadow-black/40">
			<table className="w-full text-left text-sm">
				<thead className="bg-zinc-900/80 text-xs uppercase tracking-widest text-zinc-500">
					<tr>
						<th className="px-6 py-4 font-medium">Date</th>
						<th className="px-6 py-4 font-medium">Description</th>
						<th className="px-6 py-4 font-medium">Category</th>
						<th className="px-6 py-4 font-medium text-right">Amount</th>
					</tr>
				</thead>
				<tbody className="divide-y divide-zinc-800/60">
					{transactions.map((tx) => (
						<tr
							key={tx.id}
							className="transition-colors hover:bg-zinc-800/40"
						>
							<td className="whitespace-nowrap px-6 py-4 text-zinc-500">
								{formatDate(tx.transactionDate)}
							</td>
							<td className="px-6 py-4">
								<div className="font-semibold tracking-tight text-zinc-100">
									{tx.description}
								</div>
								<div className="text-[10px] uppercase tracking-widest text-zinc-500">
									{tx.source}
								</div>
							</td>
							<td className="px-6 py-4">
								<span
									className={clsx(
										"inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium",
										tx.type === "income"
											? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
											: "border-rose-500/20 bg-rose-500/10 text-rose-400",
									)}
								>
									{tx.category.name}
								</span>
							</td>
							<td
								className={clsx(
									"whitespace-nowrap px-6 py-4 text-right font-semibold",
									tx.type === "income" ? "text-emerald-400" : "text-rose-400",
								)}
							>
								{tx.type === "income" ? "+" : "-"} {formatCurrency(tx.amount)}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
