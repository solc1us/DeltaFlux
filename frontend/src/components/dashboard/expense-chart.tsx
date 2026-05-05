"use client";

import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	Cell,
} from "recharts";

interface Props {
	data: { category: string; amount: number }[];
}

const COLORS = ["#10b981", "#38bdf8", "#f59e0b", "#a78bfa", "#f43f5e"];

export default function ExpenseChart({ data }: Props) {
	const formatCurrency = (val: number) =>
		new Intl.NumberFormat("id-ID", {
			style: "currency",
			currency: "IDR",
			notation: "compact",
		}).format(val);

	return (
		<div className="h-[350px] w-full rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-6 shadow-sm transition-all duration-300 hover:border-zinc-700 hover:shadow-2xl hover:shadow-black/40">
			<h3 className="mb-6 text-lg font-semibold tracking-tight text-zinc-100">
				Expense by Category
			</h3>
			<div className="h-[280px] w-full">
				<ResponsiveContainer width="99%" height="100%">
					<BarChart
						data={data}
						margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
					>
						<CartesianGrid
							strokeDasharray="3 3"
							vertical={false}
							stroke="#27272a"
						/>
						<XAxis
							dataKey="category"
							axisLine={false}
							tickLine={false}
							tick={{ fill: "#71717a", fontSize: 12 }}
						/>
						<YAxis
							axisLine={false}
							tickLine={false}
							tick={{ fill: "#71717a", fontSize: 12 }}
							tickFormatter={formatCurrency}
						/>
						<Tooltip
							cursor={{ fill: "#18181b" }}
							contentStyle={{
								borderRadius: "12px",
								border: "1px solid rgb(63 63 70 / 0.7)",
								backgroundColor: "rgb(24 24 27 / 0.95)",
								color: "#f4f4f5",
								boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.6)",
							}}
							formatter={(value: unknown) => {
								const numericValue =
									typeof value === "number" ? value : Number(value ?? 0);
								return [formatCurrency(numericValue), "Amount"];
							}}
						/>
						<Bar dataKey="amount" radius={[6, 6, 0, 0]} barSize={40}>
							{data.map((_, index) => (
								<Cell
									key={`cell-${index}`}
									fill={COLORS[index % COLORS.length]}
								/>
							))}
						</Bar>
					</BarChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
}
