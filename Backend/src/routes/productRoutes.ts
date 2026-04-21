import express from "express";
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "../controllers/productController";

import {
  createProductionSchema,
  updateProductionSchema,
} from "../validations/production.validation.js";
import { authenticate } from "@/middlewares/authMiddleware.js";
import { validate } from "@/middlewares/validate.middleware.js";

const router = express.Router();

router.get("/", authenticate, getProducts);
router.post("/", validate(createProductionSchema), authenticate, createProduct);
router.patch(
  "/:id",
  validate(updateProductionSchema),
  authenticate,
  updateProduct,
);
router.delete("/:id", authenticate, deleteProduct);

export default router;
