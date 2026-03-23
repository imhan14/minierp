import express from "express";
import { authenticate } from "../middlewares/authMiddleware";
import { validate } from "../middlewares/validate.middleware";
import {
  createProductReportDetail,
  getProductReportDetail,
} from "../controllers/productReportDetailController";

const router = express.Router();

router.get("/", authenticate, getProductReportDetail);
router.post("/", authenticate, createProductReportDetail);

export default router;
