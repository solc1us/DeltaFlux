// 1. Ini yang kita TERIMA (Entity dari GET)
export interface Category {
	name: string;
	type: "income" | "expense";
}

export interface Transaction {
	id: string;
	type: "income" | "expense";
	amount: string;
	source: string;
	description: string;
	transactionDate: string; // Mapping dari transaction_date backend
	category: Category; // Nested object buat Table
}

// 2. Ini yang kita KIRIM (Payload buat POST)
export interface CreateTransactionInput {
	type: "income" | "expense";
	amount: number;
	category_id: string; // Flat ID buat DB
	source: string;
	description: string;
	transaction_date: string;
}

export interface TransactionResponse {
	transactions: Transaction[];
}
