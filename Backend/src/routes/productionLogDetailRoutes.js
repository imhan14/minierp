import express from "express";
import { authenticate } from "../middlewares/authMiddleware";
import { validate } from "../middlewares/validate.middleware";
import {
  createProductionLogDetail,
  deleteProductionLogDetail,
  getProductionLogDetail,
  updateProductionLogDetail,
} from "../controllers/productionLogDetailController";
import {
  createProductLogDetailSchema,
  updateProductLogDetailSchema,
} from "../validations/productionLogDetail.validation";

const router = express.Router();

router.get("/", authenticate, getProductionLogDetail);
router.patch(
  "/:id",
  authenticate,
  validate(updateProductLogDetailSchema),
  updateProductionLogDetail,
);
router.post(
  "/",
  authenticate,
  validate(createProductLogDetailSchema),
  createProductionLogDetail,
);
router.delete("/:id", authenticate, deleteProductionLogDetail);

export default router;
