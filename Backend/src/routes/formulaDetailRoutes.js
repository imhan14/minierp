import express from "express";
import {
  createFormulaDetail,
  getFormulaDetail,
  updateFormulaDetail,
} from "../controllers/formulaDetailController";
import { authenticate } from "../middlewares/authMiddleware";
import { validate } from "../middlewares/validate.middleware";
import {
  createFormulaDetailSchema,
  updateFormulaDetailSchema,
} from "../validations/formulaDetail.validate";

const router = express.Router();

router.get("/", authenticate, getFormulaDetail);
router.post(
  "/",
  authenticate,
  validate(createFormulaDetailSchema),
  createFormulaDetail,
);
router.patch(
  "/:id",
  authenticate,
  validate(updateFormulaDetailSchema),
  updateFormulaDetail,
);

export default router;
