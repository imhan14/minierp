import {
  CreateIngredientData,
  IngredientFilters,
  UpdateIngredientData,
} from "@/types/ingredient.type.ts";
import { prisma } from "../../lib/prisma.ts";

export const getIngredientsService = async (filters: IngredientFilters) => {
  const { id } = filters;
  return await prisma.ingredients.findMany({
    where: {
      id: id ? Number(id) : undefined,
    },
  });
};

export const createIngredientService = async (
  ingredientData: CreateIngredientData,
) => {
  return await prisma.ingredients.create({
    data: ingredientData,
  });
};

export const updateIngredientService = async (
  id: number,
  ingredientData: UpdateIngredientData,
) => {
  return await prisma.ingredients.update({
    where: { id: id },
    data: ingredientData,
  });
};

export const deleteIngredientService = async (id: number) => {
  return await prisma.ingredients.delete({
    where: { id },
  });
};
