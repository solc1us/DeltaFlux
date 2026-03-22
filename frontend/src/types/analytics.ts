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
