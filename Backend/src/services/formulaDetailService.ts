import {
  CreateFormulaDetailData,
  FormulaDetailFilters,
  UpdateFormulaDetailData,
} from "@/types/formulaDetail.type.ts";
import { prisma } from "../../lib/prisma.ts";

export const createFormulaDetailService = async (
  data: CreateFormulaDetailData,
) => {
  return await prisma.formula_details.create({
    data: data,
  });
};

export const getFormulaDetailService = async (
  filters: FormulaDetailFilters,
) => {
  const { formula_id } = filters;
  return await prisma.formula_details.findMany({
    where: { formula_id: formula_id },
    select: {
      id: true,
      ingredients: {
        select: {
          id: true,
          unit: true,
          ingredient_name: true,
        },
      },
      standard_quality: true,
    },
  });
};

export const updateFormulaDetailService = async (
  id: number,
  data: UpdateFormulaDetailData,
) => {
  return await prisma.formula_details.update({
    where: { id: id },
    data: data,
  });
};

export const deleteFormulaDetetailService = async (id: number) => {
  return await prisma.formula_details.delete({
    where: { id: id },
  });
};
