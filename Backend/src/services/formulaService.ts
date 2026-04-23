import { FormulaFilters, UpdateFormulaData } from "@/types/formula.type";
import { prisma } from "../../lib/prisma.ts";
import { Prisma } from "../../generated/prisma/client";

export const getAllFormlasService = async (filters: FormulaFilters) => {
  const {
    id,
    search,
    active,
    line,
    specification,
    color,
    typeOfSpecification,
    orderBy,
  } = filters;
  const where: Prisma.formulasWhereInput = {};
  if (id) where.id = id;
  if (active !== undefined) where.is_active = active;
  if (line) where.product_line = line;
  if (specification) where.specification = specification;
  if (color) where.color = color;
  if (typeOfSpecification) where.type_of_specification = typeOfSpecification;

  if (search && search.trim() !== "") {
    const searchTrim = search.trim();
    const searchAsNumber = parseInt(searchTrim);

    const orConditions: Prisma.formulasWhereInput[] = [
      { formula_name: { contains: searchTrim, mode: "insensitive" } },
    ];
    if (!isNaN(searchAsNumber)) {
      orConditions.push({ formula_code: searchAsNumber });
    }

    where.OR = orConditions;
  }

  let sortField = "id";
  let sortDirection: Prisma.SortOrder = "desc";
  if (orderBy && orderBy.includes(":")) {
    const parts = orderBy.split(":");
    sortField = parts[0];
    sortDirection = parts[1] as Prisma.SortOrder;
  }
  return await prisma.formulas.findMany({
    where,
    select: {
      id: true,
      formula_code: true,
      formula_name: true,
      products: { select: { id: true, product_name: true } },
      product_line: true,
      is_active: true,
      specification: true,
      color: true,
      type_of_specification: true,
    },
    orderBy: { [sortField]: sortDirection } as Record<string, Prisma.SortOrder>,
  });
};

export const createFormulaService = async () => {
  const newFormula = await prisma.formulas.create({
    data: {
      is_active: true,
    },
  });
  const updatedFormula = await prisma.formulas.update({
    where: { id: newFormula.id },
    data: {
      formula_code: newFormula.id,
    },
  });
  return updatedFormula;
};

export const updateFormulaService = async (
  id: number,
  data: UpdateFormulaData,
) => {
  return await prisma.formulas.update({
    where: { id: id },
    data: data,
  });
};
