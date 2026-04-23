import {
  CreateProductReportDetailData,
  ProductReportDetailFilters,
  UpdateProductReportDetailData,
} from "@/types/productReportDetail.type.ts";
import { prisma } from "../../lib/prisma.ts";

export const getProductReportDetailSercive = async (
  filters: ProductReportDetailFilters,
) => {
  const { id, report_id } = filters;
  return await prisma.reports_products.findMany({
    where: {
      ...(id && { id: id }),
      ...(report_id && { report_id: report_id }),
    },
    select: {
      id: true,
      products: {
        select: {
          id: true,
          product_name: true,
        },
      },
      report_id: true,
      is_finish: true,
      type_of_specification: true,
      product_line: true,
      specification: true,
      start_time: true,
      end_time: true,
      weight: true,
      note: true,
    },
    orderBy: { id: "asc" },
  });
};

export const createProductReportDetailService = async (
  data: CreateProductReportDetailData,
) => {
  return await prisma.reports_products.create({
    data: data,
  });
};

export const updateProductReportDetailService = async (
  id: number,
  data: UpdateProductReportDetailData,
) => {
  return await prisma.reports_products.update({
    where: { id: id },
    data: data,
  });
};
export const deleteProductReportDetailService = async (id: number) => {
  return await prisma.reports_products.delete({
    where: { id: id },
  });
};
