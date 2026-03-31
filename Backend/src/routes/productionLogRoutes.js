import express from "express";
import { authenticate } from "../middlewares/authMiddleware";
import { validate } from "../middlewares/validate.middleware";
import {
  createProductionLog,
  getProductionLog,
} from "../controllers/productionLogController";
import { createProductLogSchema } from "../validations/productionLog.validation";

const router = express.Router();

router.get("/", authenticate, getProductionLog);
router.post(
  "/",
  authenticate,
  validate(createProductLogSchema),
  createProductionLog,
);

export default router;
