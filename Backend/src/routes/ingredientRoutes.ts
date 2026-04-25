import express from "express";
import { validate } from "../middlewares/validate.middleware";
import { authenticate } from "../middlewares/authMiddleware";
import {
  createIngredientSchema,
  updateIngredientSchema,
} from "../validations/ingredient.validation";
import {
  createIngredient,
  getIngredients,
  updateIngredient,
} from "../controllers/ingredientController";

const router = express.Router();

router.get("/", authenticate, getIngredients);
router.post(
  "/",
  authenticate,
  validate(createIngredientSchema),
  createIngredient,
);
router.patch(
  "/:id",
  authenticate,
  validate(updateIngredientSchema),
  updateIngredient,
);

export default router;
