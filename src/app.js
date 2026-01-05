import express from "express";
import noteRouters from "./routes/noteRouters.js";

const app = express();
app.use(express.json());

app.use("/notes", noteRouters);

export default app;
