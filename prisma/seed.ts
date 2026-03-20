import { PrismaClient, Prisma } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";

// 1. Load .env secara manual karena seed jalan di luar flow app.ts
dotenv.config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
	throw new Error("DATABASE_URL is not defined in .env");
}

// 2. Setup Driver Adapter (Sama kayak di config/prisma.ts)
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
	console.log("Start seeding...");

	// 1. Bersihin data lama (Optional, ati-ati kalo di prod)
	// await prisma.transaction.deleteMany();
	// await prisma.category.deleteMany();
	// await prisma.user.deleteMany();

	// 2. Buat User dummy (pake email yang biasa lu pake login)
	const user = await prisma.user.create({
		data: {
			email: "marcel@mail.com",
			username: "marcel",
			passwordHash: "$2b$10$YourHashedPasswordHere", // Pastikan sesuai bcrypt kalo mau dipake login
			name: "Marcel",
		},
	});

	// 3. Buat Kategori
	const catFood = await prisma.category.create({
		data: { name: "Food", type: "expense", userId: user.id },
	});
	const catSalary = await prisma.category.create({
		data: { name: "Salary", type: "income", userId: user.id },
	});
	const catTransport = await prisma.category.create({
		data: { name: "Transport", type: "expense", userId: user.id },
	});

	// 4. Buat Transaksi (Variasi Tanggal)
	const transactions: Prisma.TransactionCreateManyInput[] = [
		// Maret 2026
		{
			amount: new Prisma.Decimal(5000000),
			type: "income",
			source: "ATM BCA",
			description: "Gaji Maret",
			transactionDate: new Date("2026-03-01"),
			userId: user.id,
			categoryId: catSalary.id,
		},
		{
			amount: new Prisma.Decimal(50000),
			type: "expense",
			source: "ATM BCA",
			description: "Makan siang",
			transactionDate: new Date("2026-03-15"),
			userId: user.id,
			categoryId: catFood.id,
		},
		{
			amount: new Prisma.Decimal(20000),
			type: "expense",
			source: "Gopay",
			description: "Gojek ke kantor",
			transactionDate: new Date("2026-03-20"),
			userId: user.id,
			categoryId: catTransport.id,
		},
		// Februari 2026 (Buat ngetes filter gak bocor)
		{
			amount: new Prisma.Decimal(150000),
			type: "expense",
			source: "Cash",
			description: "Belanja bulanan",
			transactionDate: new Date("2026-02-28"),
			userId: user.id,
			categoryId: catFood.id,
		},
		{
			amount: new Prisma.Decimal(3000000),
			type: "income",
			source: "ATM BCA",
			description: "Bonus Februari",
			transactionDate: new Date("2026-02-15"),
			userId: user.id,
			categoryId: catSalary.id,
		},
	];

	await prisma.transaction.createMany({ data: transactions });

	console.log("Seeding finished.");
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
