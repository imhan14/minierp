import express from "express";
import { authenticate, authorize } from "@/middlewares/authMiddleware";
import { validate } from "@/middlewares/validate.middleware";
import {
  createWarehouseTransaction,
  getWarehouseInventory,
  getWarehouseTransactions,
} from "@/controllers/warehouseController";
import { createWarehouseTransactionSchema } from "@/validations/warehouse.validation";

const router = express.Router();
const warehouseRoleOnly = [6];

router.use(authenticate, authorize(warehouseRoleOnly));
router.get("/inventory", getWarehouseInventory);
router.get("/transactions", getWarehouseTransactions);
router.post(
  "/transactions",
  validate(createWarehouseTransactionSchema),
  createWarehouseTransaction,
);

export default router;
