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
app.use(
	cors({
		origin: "http://localhost:3001", // FE running on port 3001
		credentials: true,
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

export default app;
