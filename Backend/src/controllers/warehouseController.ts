import type { Request, Response } from "express";
import catchAsync from "@/utils/catchAsync";
import {
  createWarehouseTransactionService,
  getWarehouseInventoryService,
  getWarehouseTransactionsService,
  type CreateWarehouseTransactionData,
} from "@/services/warehouseService";

export const getWarehouseInventory = catchAsync(
  async (_req: Request, res: Response) => {
    res.status(200).json(await getWarehouseInventoryService());
  },
);

export const getWarehouseTransactions = catchAsync(
  async (_req: Request, res: Response) => {
    res.status(200).json(await getWarehouseTransactionsService());
  },
);

export const createWarehouseTransaction = catchAsync(
  async (req: Request, res: Response) => {
    const transaction = await createWarehouseTransactionService(
      req.body as CreateWarehouseTransactionData,
      req.users!.id,
    );
    res.status(201).json(transaction);
  },
);
