import { prisma } from "../../lib/prisma.ts";

export const getProductionLogDetailService = async (filters) => {
  const { id, production_log_id } = filters;
  return await prisma.production_log_detail.findMany({
    where: { production_log_id: production_log_id },
    orderBy: { id: "asc" },
  });
};

export const createProductionLogDetailService = async (data) => {
  return await prisma.production_log_detail.create({
    data: data,
  });
};

export const updateProductionLogDetailService = async (id, data) => {
  return await prisma.production_log_detail.update({
    where: { id: id },
    data: data,
  });
};

export const deleteProductionDetailService = async (id) => {
  return await prisma.production_log_detail.delete({
    where: { id: id },
  });
};
