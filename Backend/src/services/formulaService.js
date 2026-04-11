import { prisma } from "../../lib/prisma";

export const getAllFormlasService = async (filters) => {
  const { id } = filters;
  const where = {};
  if (id) where.id = id;
  return await prisma.formulas.findMany({
    where,
    orderBy: { id: "asc" },
  });
};
