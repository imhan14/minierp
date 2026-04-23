import { Request, Response } from "express";
import {
  createMaterialDetailsService,
  getMaterialDetailService,
  updateMaterialDetailService,
} from "../services/materialDetailService";
import { UpdateMaterialDetailData } from "@/types/materialDetail.type";
import catchAsync from "@/utils/catchAsync";

export const createMaterialDetails = catchAsync(
  async (req: Request, res: Response) => {
    const materialDetails = await createMaterialDetailsService(req.body);
    res.status(201).json(materialDetails);
  },
);

export const getMaterialDetail = catchAsync(
  async (req: Request, res: Response) => {
    const filters = {
      material_id: req.query.material_id
        ? Number(req.query.material_id)
        : undefined,
    };
    const materialDetails = await getMaterialDetailService(filters);
    res.status(200).json(materialDetails);
  },
);

export const updateMaterialDetail = catchAsync(
  async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const data: UpdateMaterialDetailData = {};
    if (req.body.weight) data.weight = Number(req.body.weight);
    if (req.body.real_percent)
      data.real_percent = Number(req.body.real_percent);
    if (req.body.note) data.note = req.body.note;
    const materialDetail = await updateMaterialDetailService(id, data);
    res.status(200).json(materialDetail);
  },
);
