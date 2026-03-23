import { prisma } from "../../lib/prisma.ts";

export const getProductReportDetailSercive = async (filters) => {
  const { id } = filters;
  return await prisma.reports_products.findMany({
    where: { id: id },
  });
};

export const createProductReportDetailService = async (data) => {
  return await prisma.reports_products.create({
    data: data,
  });
};
