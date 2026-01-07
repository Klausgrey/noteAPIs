import express from "express";
import noteRouters from "./routes/noteRouters.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();
app.use(express.json());

app.use("/notes", noteRouters);

app.use(errorHandler);

export default app;
