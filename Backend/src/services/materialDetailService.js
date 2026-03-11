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
