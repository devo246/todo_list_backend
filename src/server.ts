// src/app.ts
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import connectDB from "./config/db";
import authRouter from "./routes/auth.route";
import taskRouter from "./routes/task.route";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors({origin: "http://localhost:5173"}));
app.use(cookieParser());

dotenv.config();
connectDB();

app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api", authRouter);
app.use("/api/tasks", taskRouter);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`server is work in: http://localhost:${PORT}`);
});
