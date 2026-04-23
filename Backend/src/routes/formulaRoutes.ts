import express from "express";

import { authenticate } from "../middlewares/authMiddleware";
import {
  createFormula,
  getAllFomulas,
  updateFormula,
} from "../controllers/formulaController";
import { formulaValidateSchema } from "../validations/formula.validate";
import { validate } from "../middlewares/validate.middleware";

const router = express.Router();

router.get("/", authenticate, getAllFomulas);
router.post("/", authenticate, createFormula);
router.patch(
  "/:id",
  authenticate,
  validate(formulaValidateSchema),
  updateFormula,
);

export default router;
