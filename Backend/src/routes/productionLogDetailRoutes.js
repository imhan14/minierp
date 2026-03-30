import express from "express";
import { authenticate } from "../middlewares/authMiddleware";
import { validate } from "../middlewares/validate.middleware";
import { getProductionLogDetail } from "../controllers/productionLogDetailController";

const router = express.Router();

router.get("/", authenticate, getProductionLogDetail);

export default router;
