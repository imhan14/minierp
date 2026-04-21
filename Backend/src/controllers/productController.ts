import type { Request, Response } from "express";
import {
  createProductService,
  deleteProductService,
  getProductsService,
  updateProductService,
} from "../services/productService";
import catchAsync from "@/utils/catchAsync";

export const createProduct = catchAsync(async (req: Request, res: Response) => {
  const product = await createProductService(req.body);
  res.status(201).json(product);
});

export const getProducts = catchAsync(async (req: Request, res: Response) => {
  const { id, search } = req.query;
  const filters: Record<string, unknown> = {
    id: id && !isNaN(Number(id)) ? Number(id) : undefined,
    search: search,
  };
  const products = await getProductsService(filters);
  res.status(200).json(products);
});

export const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const product = await updateProductService(req.params, req.body);
  res.status(200).json(product);
});

export const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  await deleteProductService(req.params);
  res.status(200).json({ message: "Deleted product successful!" });
});
