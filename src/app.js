import express from "express";
import noteRouters from "./routes/noteRouters.js";
import authRouters from "./routes/authRouters.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();
app.use(express.json());

// Auth routes (no authentication required)
app.use("/auth", authRouters);

// Note routes (authentication required)
app.use("/notes", noteRouters);

app.use(errorHandler);

export default app;
