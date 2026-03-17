import {
  createMaterialDetails,
  getMaterialDetail,
  updateMaterialDetail,
} from "../controllers/materialDetailController";
import express from "express";
import { validate } from "../middlewares/validate.middleware";
import { authenticate } from "../middlewares/authMiddleware";
import {
  bulkDetailsSchema,
  updateMaterialDetailSchema,
} from "../validations/materialDetail.validation";

const router = express.Router();

router.post(
  "/",
  validate(bulkDetailsSchema),
  authenticate,
  createMaterialDetails,
);
router.get("/", authenticate, getMaterialDetail);
router.patch(
  "/:id",
  authenticate,
  validate(updateMaterialDetailSchema),
  updateMaterialDetail,
);
export default router;
