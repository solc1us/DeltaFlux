// src/server.ts
import app from "./app";
import { env } from "./config/env";

app.listen(env.port, () => {
	console.log(
		`[${new Date().toLocaleTimeString()}] Server running on port ${env.port} in ${env.nodeEnv} mode`,
	);
});
