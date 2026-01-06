// server.js
import "dotenv/config";
import app from "./src/app.js";
import { initDb } from "./src/db/db.js";

const PORT = process.env.PORT || 3000;

async function start() {
	try {
		await initDb();
		app.listen(PORT, () => {
			console.log(`Server running at http://localhost:${PORT}`);
		});
	} catch (err) {
		console.error("Failed to start server:", err);
		process.exit(1);
	}
}

start();
