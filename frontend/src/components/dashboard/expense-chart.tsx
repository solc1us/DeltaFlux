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

const COLORS = ["#000000", "#4B5563", "#9CA3AF", "#D1D5DB", "#E5E7EB"];

export default function ExpenseChart({ data }: Props) {
	const formatCurrency = (val: number) =>
		new Intl.NumberFormat("id-ID", {
			style: "currency",
			currency: "IDR",
			notation: "compact",
		}).format(val);

	return (
		<div className="h-[350px] w-full rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
			<h3 className="mb-6 text-lg font-bold text-gray-900">
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
							stroke="#F3F4F6"
						/>
						<XAxis
							dataKey="category"
							axisLine={false}
							tickLine={false}
							tick={{ fill: "#9CA3AF", fontSize: 12 }}
						/>
						<YAxis
							axisLine={false}
							tickLine={false}
							tick={{ fill: "#9CA3AF", fontSize: 12 }}
							tickFormatter={formatCurrency}
						/>
						<Tooltip
							cursor={{ fill: "#F9FAFB" }}
							contentStyle={{
								borderRadius: "12px",
								border: "none",
								boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
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
