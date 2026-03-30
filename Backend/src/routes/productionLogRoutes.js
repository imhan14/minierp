import express from "express";
import { authenticate } from "../middlewares/authMiddleware";
import { validate } from "../middlewares/validate.middleware";
import { getProductionLog } from "../controllers/productionLogController";

const router = express.Router();

router.get("/", authenticate, getProductionLog);

export default router;
