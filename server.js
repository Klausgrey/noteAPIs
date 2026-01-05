import "dotenv/config"
import app from './src/app.js';

// process.env.PORT reads the value from your .env file
// We keep 3000 as a "fallback" just in case the .env is missing
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
	console.log(`Server running at http://localhost:${PORT}`);
});
