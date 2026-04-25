import {
  CreateIngredientData,
  IngredientFilters,
  UpdateIngredientData,
} from "@/types/ingredient.type.ts";
import { prisma } from "../../lib/prisma.ts";
import { Prisma } from "../../generated/prisma/client.ts";

export const getIngredientsService = async (filters: IngredientFilters) => {
  const { id, unit, search, orderBy } = filters;

  const where: Prisma.ingredientsWhereInput = {};
  if (id) where.id = id;
  if (unit) where.unit = unit;
  if (search && search.trim() !== "") {
    const searchTrim = search.trim();
    const searchCode = searchTrim;
    const orConditions: Prisma.ingredientsWhereInput[] = [
      { ingredient_name: { contains: searchTrim, mode: "insensitive" } },
    ];
    if (!searchCode) {
      orConditions.push({ ingredient_code: searchCode });
    }
    where.OR = orConditions;
  }
  let sortField = "id";
  let sortDirection: Prisma.SortOrder = "asc";
  if (orderBy && orderBy.includes(":")) {
    const parts = orderBy.split(":");
    sortField = parts[0];
    sortDirection = parts[1] as Prisma.SortOrder;
  }

  return await prisma.ingredients.findMany({
    where,
    orderBy: { [sortField]: sortDirection } as Record<string, Prisma.SortOrder>,
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
