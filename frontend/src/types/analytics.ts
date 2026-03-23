export interface SummaryData {
	current: {
		income: number;
		expense: number;
		balance: number;
	};
	analysis: {
		income_growth: number;
		expense_growth: number;
	};
	metadata: {
		has_previous_data: boolean;
	};
}

export interface ChartData {
	category: string;
	amount: number;
	fill?: string;
}

export interface AnalyticsResponse {
	expense_breakdown: ChartData[];
}

export interface CategoryDeviation {
	categoryId: string;
	categoryName: string;
	currentTotal: number;
	previousTotal: number;
	momPercentage: number | null; // Null kalo bulan lalu 0 (avoid division by zero)
	isSignificant: boolean;
}

export interface DeviationResponse {
	deviations: CategoryDeviation[];
}
