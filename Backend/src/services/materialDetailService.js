import { prisma } from "../../lib/prisma.ts";

export const createMaterialDetailsService = async (data) => {
  return await prisma.material_details.createMany({
    data: data,
    skipDuplicates: true,
  });
};

export const updateMaterialDetailService = async (id, data) => {
  return await prisma.material_details.update({
    where: { id: id },
    data: data,
  });
};

export const getMaterialDetailService = async (filters) => {
  const { material_id } = filters;
  return await prisma.material_details.findMany({
    where: {
      material_id: material_id,
    },
    select: {
      id: true,
      material_id: true,
      ingredients: {
        select: { ingredient_name: true, id: true },
      },
      weight: true,
      real_percent: true,
      note: true,
    },
    orderBy: { id: "asc" },
  });
};
