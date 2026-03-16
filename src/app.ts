// src/app.ts
import express from 'express';
import router from './routes';
import { errorMiddleware } from './middleware/error.middleware';

const app = express();

app.use(express.json());

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get("/", (_req, res) => {
  res.status(200).json({ message: "DeltaFlux API running" });
});

app.use('/api', router);

app.use(errorMiddleware);

export default app;
