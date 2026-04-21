import "dotenv/config";
import express from "express";
import cors from "cors";
import rootRouter from "./src/routes/index.js";
import { globalErrorHandler } from "./src/middlewares/errorMiddleware.js";
const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  }),
);

app.use(express.json());

// routes
app.use("/api", rootRouter);

app.use(globalErrorHandler);
// PORT
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
