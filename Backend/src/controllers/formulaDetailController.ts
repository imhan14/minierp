import { Request, Response } from "express";
import {
  createFormulaDetailService,
  getFormulaDetailService,
  updateFormulaDetailService,
} from "../services/formulaDetailService";
import {
  CreateFormulaDetailData,
  UpdateFormulaDetailData,
} from "@/types/formulaDetail.type";
import catchAsync from "@/utils/catchAsync";

export const getFormulaDetail = catchAsync(
  async (req: Request, res: Response) => {
    const filters = {
      formula_id: req.query.formula_id
        ? Number(req.query.formula_id)
        : undefined,
    };
    const formulaDetail = await getFormulaDetailService(filters);
    res.status(200).json(formulaDetail);
  },
);

export const createFormulaDetail = catchAsync(
  async (req: Request, res: Response) => {
    const { formula_id, ingredient_id, standard_quality } = req.body;

    const formulaDetail = await createFormulaDetailService({
      formula_id: Number(formula_id),
      ingredient_id: Number(ingredient_id),
      standard_quality: Number(standard_quality),
    });
    res.status(201).json(formulaDetail);
  },
);

export const updateFormulaDetail = catchAsync(
  async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (isNaN(id)) throw new Error("Invalid ID");
    const { formula_id, ingredient_id, standard_quality } = req.body;
    const updateData: UpdateFormulaDetailData = {};
    if (formula_id !== undefined) updateData.formula_id = Number(formula_id);
    if (ingredient_id !== undefined)
      updateData.ingredient_id = Number(ingredient_id);
    if (standard_quality !== undefined)
      updateData.standard_quality = Number(standard_quality);

    const formulaDetail = await updateFormulaDetailService(id, updateData);
    res.status(200).json(formulaDetail);
  },
);
