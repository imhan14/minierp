import { Request, Response } from "express";
import {
  createProductionLogDetailService,
  deleteProductionDetailService,
  getProductionLogDetailService,
  updateProductionLogDetailService,
} from "../services/productionLogDetailService";
import {
  CreateProductionLogDetailData,
  UpdateProductionLogDetailData,
} from "@/types/productionLogDetail.type";

export const getProductionLogDetail = async (req: Request, res: Response) => {
  const filters = {
    id: req.query.id ? Number(req.query.id) : undefined,
    production_log_id: req.query.production_log_id
      ? Number(req.query.production_log_id)
      : undefined,
  };
  const productionLogDetail = await getProductionLogDetailService(filters);
  res.status(200).json(productionLogDetail);
};

export const createProductionLogDetail = async (
  req: Request,
  res: Response,
) => {
  const createData: CreateProductionLogDetailData = { ...req.body };

  const productLogDetail = await createProductionLogDetailService(createData);
  res.status(201).json(productLogDetail);
};

export const updateProductionLogDetail = async (
  req: Request,
  res: Response,
) => {
  const id = Number(req.params.id);

  let updateData: UpdateProductionLogDetailData = { ...req.body };

  const productLogDetail = await updateProductionLogDetailService(
    id,
    updateData,
  );
  res.status(200).json(productLogDetail);
};

export const deleteProductionLogDetail = async (
  req: Request,
  res: Response,
) => {
  const id = Number(req.params.id);
  await deleteProductionDetailService(id);
  res.status(200).json({ message: "Deleted successful!" });
};
