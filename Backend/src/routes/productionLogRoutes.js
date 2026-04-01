import express from "express";
import { authenticate } from "../middlewares/authMiddleware";
import { validate } from "../middlewares/validate.middleware";
import {
  createProductionLog,
  getProductionLog,
  updateProductionLog,
} from "../controllers/productionLogController";
import {
  createProductLogSchema,
  updateProductLogSchema,
} from "../validations/productionLog.validation";

const router = express.Router();

router.get("/", authenticate, getProductionLog);
router.post(
  "/",
  authenticate,
  validate(createProductLogSchema),
  createProductionLog,
);
router.patch(
  "/:id",
  authenticate,
  validate(updateProductLogSchema),
  updateProductionLog,
);

export default router;
