import { Request, Response } from "express";
import {
  createFormulaService,
  getAllFormlasService,
  updateFormulaService,
} from "../services/formulaService.js";
import { FormulaFilters } from "@/types/formula.type";
import catchAsync from "@/utils/catchAsync";

export const getAllFomulas = async (req: Request, res: Response) => {
  const filters: FormulaFilters = {
    id: req.query.id ? Number(req.query.id) : undefined,
    search: req.query.search ? String(req.query.search) : undefined,
    active:
      req.query.active === "true"
        ? true
        : req.query.active === "false"
          ? false
          : undefined,
    line: req.query.line ? String(req.query.line) : undefined,
    specification: req.query.specification
      ? String(req.query.specification)
      : undefined,
    color: req.query.color ? String(req.query.color) : undefined,
    typeOfSpecification: req.query.typeOfSpecification
      ? String(req.query.typeOfSpecification)
      : undefined,
    orderBy: req.query.orderBy ? String(req.query.orderBy) : undefined,
  };
  const formulas = await getAllFormlasService(filters);
  res.status(200).json(formulas);
};

export const createFormula = catchAsync(async (req: Request, res: Response) => {
  const newFormula = await createFormulaService();
  res.status(201).json(newFormula);
});

export const updateFormula = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const fields = [
    "formula_code",
    "formula_name",
    "product_id",
    "is_active",
    "product_line",
    "specification",
    "color",
    "type_of_specification",
  ];
  let updateData: Record<string, unknown> = {};
  fields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  });
  const formula = await updateFormulaService(id, updateData);
  res.status(200).json(formula);
});
