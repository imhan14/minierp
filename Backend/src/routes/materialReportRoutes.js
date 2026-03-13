import {
  createMaterialReport,
  getMaterialReport,
  updateMaterialReport,
} from "../controllers/materialReportController";
import express from "express";
import { validate } from "../middlewares/validate.middleware";
import { authenticate } from "../middlewares/authMiddleware";
import {
  createMaterialReportSchema,
  updateMaterialReportSchema,
} from "../validations/materialReport.validation";

const router = express.Router();

router.post(
  "/",
  validate(createMaterialReportSchema),
  authenticate,
  createMaterialReport,
);
router.get("/", authenticate, getMaterialReport);
router.patch(
  "/:id",
  authenticate,
  validate(updateMaterialReportSchema),
  updateMaterialReport,
);
export default router;
