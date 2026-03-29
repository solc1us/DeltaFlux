// src/app.ts
import express from "express";
import router from "./routes";
import { errorMiddleware } from "./middleware/error.middleware";
import authRoute from "./routes/auth.route";
import protectedRoute from "./routes/protected.route";
import transactionRoute from "./routes/transaction.route";
import categoryRoutes from "./routes/category.route";
import analyticsRoute from "./routes/analytics.route";
import cors from "cors";

const app = express();

app.use(express.json());

const allowedOrigins = [
	process.env.CORS_ORIGIN?.replace(/\/$/, ""), // Hapus trailing slash kalau ada
	"http://localhost:3000",
	"http://localhost:3001",
].filter(Boolean) as string[];

app.use(
	cors({
		origin: (origin, callback) => {
			// Jika tidak ada origin (Postman) atau origin terdaftar
			if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ""))) {
				callback(null, true);
			} else {
				console.error(`CORS Blocked for origin: ${origin}`);
				callback(new Error("Not allowed by CORS"));
			}
		},
		methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
		credentials: true,
		optionsSuccessStatus: 200, // Penting: Balikin 200 buat OPTIONS
	}),
);

// 2. Health Check (Optional tapi good practice)
app.get("/health", (_req, res) => {
	res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

// 3. Root Route (Optional, bisa diakses tanpa auth)
app.get("/", (_req, res) => {
	res.status(200).json({ message: "DeltaFlux API running" });
});

// 4. API Routes
app.use("/api", router);
app.use("/api/auth", authRoute);
app.use("/api/categories", categoryRoutes); // Endpoint: /api/categories
app.use("/api/analytics", analyticsRoute); // Endpoint: /api/analytics
app.use("/api/transactions", transactionRoute); // Endpoint: /api/transactions
app.use("/api/protected", protectedRoute);

// Error handling middleware harus di paling bawah setelah semua route
app.use(errorMiddleware);

// Logic Penting: Cek apakah jalan di Vercel atau Local
if (process.env.NODE_ENV !== "production") {
	const PORT = process.env.PORT || 5000;
	app.listen(PORT, () => {
		console.log(`Server is running on port ${PORT}`);
	});
}

export default app;
