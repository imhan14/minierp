import { Request, Response } from "express";
import {
  createProductReportDetailService,
  deleteProductReportDetailService,
  getProductReportDetailSercive,
  updateProductReportDetailService,
} from "../services/productReportDetailService";
import {
  CreateProductReportDetailData,
  UpdateProductReportDetailData,
} from "@/types/productReportDetail.type";

export const getProductReportDetail = async (req: Request, res: Response) => {
  const filters = {
    id: req.query.id ? Number(req.query.id) : undefined,
    report_id: req.query.report_id ? Number(req.query.report_id) : undefined,
  };
  const productReportDetails = await getProductReportDetailSercive(filters);
  res.status(200).json(productReportDetails);
};

export const createProductReportDetail = async (
  req: Request,
  res: Response,
) => {
  const createData: CreateProductReportDetailData = { ...req.body };

  const productReportDetail =
    await createProductReportDetailService(createData);
  res.status(201).json(productReportDetail);
};

export const updateProductReportDetail = async (
  req: Request,
  res: Response,
) => {
  const id = Number(req.params.id);
  const updateData: UpdateProductReportDetailData = { ...req.body };

  const productReportDetail = await updateProductReportDetailService(
    id,
    updateData,
  );
  res.status(200).json(productReportDetail);
};

export const deleteProductReportDetail = async (
  req: Request,
  res: Response,
) => {
  const id = Number(req.params.id);
  await deleteProductReportDetailService(id);
  res.status(200).json({ message: "Deleted successful!" });
};
