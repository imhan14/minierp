import { prisma } from "../../lib/prisma.ts";

export const createFormulaDetailService = async (data) => {
  return await prisma.formula_details.create({
    data: data,
  });
};

export const getFormulaDetailService = async (filters) => {
  const { formula_id } = filters;
  return await prisma.formula_details.findMany({
    where: { formula_id: formula_id },
    select: {
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

export const updateFormulaDetailService = async (id, data) => {
  return await prisma.formula_details.update({
    where: { id: id },
    data: data,
  });
};

export const deleteFoemulaDetetailService = async (id) => {};
