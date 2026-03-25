import express from "express";
import { authenticate } from "../middlewares/authMiddleware";
import { validate } from "../middlewares/validate.middleware";
import {
  createProductReportDetail,
  deleteProductReportDetail,
  getProductReportDetail,
  updateProductReportDetail,
} from "../controllers/productReportDetailController";
import {
  createProductionReportDetailSchema,
  updateProductionReportDetailSchema,
} from "../validations/productionReportDetail.validation";

const router = express.Router();

router.get("/", authenticate, getProductReportDetail);
router.post(
  "/",
  authenticate,
  validate(createProductionReportDetailSchema),
  createProductReportDetail,
);
router.patch(
  "/:id",
  authenticate,
  validate(updateProductionReportDetailSchema),
  updateProductReportDetail,
);
router.delete("/:id", authenticate, deleteProductReportDetail);

export default router;
