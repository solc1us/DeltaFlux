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
		<div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
			<table className="w-full text-left text-sm">
				<thead className="bg-gray-50 text-xs uppercase text-gray-500">
					<tr>
						<th className="px-6 py-4 font-medium">Date</th>
						<th className="px-6 py-4 font-medium">Description</th>
						<th className="px-6 py-4 font-medium">Category</th>
						<th className="px-6 py-4 font-medium text-right">Amount</th>
					</tr>
				</thead>
				<tbody className="divide-y divide-gray-100">
					{transactions.map((tx) => (
						<tr key={tx.id} className="hover:bg-gray-50 transition-colors">
							<td className="whitespace-nowrap px-6 py-4 text-gray-600">
								{formatDate(tx.transactionDate)}
							</td>
							<td className="px-6 py-4">
								<div className="font-medium text-gray-900">
									{tx.description}
								</div>
								<div className="text-xs text-gray-400">{tx.source}</div>
							</td>
							<td className="px-6 py-4">
								<span
									className={clsx(
										"inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
										tx.type === "income"
											? "bg-green-50 text-green-700"
											: "bg-red-50 text-red-700",
									)}
								>
									{tx.category.name}
								</span>
							</td>
							<td
								className={clsx(
									"whitespace-nowrap px-6 py-4 text-right font-semibold",
									tx.type === "income" ? "text-green-600" : "text-red-600",
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
