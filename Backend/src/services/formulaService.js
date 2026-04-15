import { prisma } from "../../lib/prisma";

export const getAllFormlasService = async (filters) => {
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

  const andConditions = [];

  if (id) andConditions.push({ id });
  if (active !== undefined) andConditions.push({ is_active: active });
  if (line) andConditions.push({ product_line: line });
  if (specification) andConditions.push({ specification });
  if (color) andConditions.push({ color });
  if (typeOfSpecification)
    andConditions.push({ type_of_specification: typeOfSpecification });

  if (search && search.trim() !== "") {
    const searchTrim = search.trim();
    const searchAsNumber = parseInt(searchTrim);

    const orConditions = [
      { formula_name: { contains: searchTrim, mode: "insensitive" } },
    ];
    if (!isNaN(searchAsNumber)) {
      orConditions.push({ formula_code: searchAsNumber });
    }

    andConditions.push({ OR: orConditions });
  }
  let sortField = "id";
  let sortDirection = "desc";
  if (orderBy && orderBy.includes(":")) {
    const parts = orderBy.split(":");
    sortField = parts[0];
    sortDirection = parts[1];
  }
  return await prisma.formulas.findMany({
    where: andConditions.length > 0 ? { AND: andConditions } : {},
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
    orderBy: { [sortField]: sortDirection },
  });
};

export const createFormulaService = async () => {
  return await prisma.formulas.create({
    data: {
      is_active: true,
    },
  });
};
