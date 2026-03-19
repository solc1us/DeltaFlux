// src/server.ts
import app from './app';
import { env } from './config/env';

app.listen(env.port, () => {
  
  const date = new Date().toLocaleString();
  console.log(`[${date}] Server started and running on port ${env.port} in ${env.nodeEnv} mode`);
});
