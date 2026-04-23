import {
  CreateProductionLogDetailData,
  ProductionLogDetailFilters,
  UpdateProductionLogDetailData,
} from "@/types/productionLogDetail.type.ts";
import { prisma } from "../../lib/prisma.ts";

export const getProductionLogDetailService = async (
  filters: ProductionLogDetailFilters,
) => {
  const { id, production_log_id } = filters;
  return await prisma.production_log_detail.findMany({
    where: { production_log_id: production_log_id },
    orderBy: { id: "asc" },
  });
};

export const createProductionLogDetailService = async (
  data: CreateProductionLogDetailData,
) => {
  return await prisma.production_log_detail.create({
    data: data,
  });
};

export const updateProductionLogDetailService = async (
  id: number,
  data: UpdateProductionLogDetailData,
) => {
  return await prisma.production_log_detail.update({
    where: { id: id },
    data: data,
  });
};

export const deleteProductionDetailService = async (id: number) => {
  return await prisma.production_log_detail.delete({
    where: { id: id },
  });
};
