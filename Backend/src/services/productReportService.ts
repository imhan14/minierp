import dayjs from "dayjs";
import { prisma } from "../../lib/prisma.ts";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import {
  CreateProductReportData,
  ProductReportFilters,
  UpdateProductReportData,
} from "@/types/productReport.type.ts";
import { Prisma } from "../../generated/prisma/client.ts";

dayjs.extend(utc);
dayjs.extend(timezone);

export const createProductReportService = async (
  data: CreateProductReportData,
) => {
  return await prisma.product_reports.create({
    data: data,
  });
};

export const getProductReportService = async (
  filters: ProductReportFilters,
) => {
  const { id, date, team_id, startDate, endDate } = filters;
  const where: Prisma.product_reportsWhereInput = {};
  if (id) {
    where.id = id;
  }
  if (team_id) {
    where.team_id = team_id;
  }
  if (startDate && endDate)
    where.report_date = {
      gte: dayjs.utc(startDate).startOf("day").toISOString(),
      lte: dayjs.utc(endDate).endOf("day").toISOString(),
    };
  else if (date)
    where.report_date = {
      gte: dayjs.utc(date).startOf("day").toISOString(),
      lte: dayjs.utc(date).endOf("day").toISOString(),
    };

  return await prisma.product_reports.findMany({
    where,
    select: {
      id: true,
      teams: {
        select: {
          id: true,
          team_name: true,
        },
      },
      furnace: true,
      report_date: true,
      shift: true,
      start_time: true,
      end_time: true,
      warehouse_check: true,
      production_check: true,
    },
    orderBy: { id: "asc" },
  });
};

export const updateProductReportService = async (
  id: number,
  data: UpdateProductReportData,
) => {
  return await prisma.product_reports.update({
    where: { id: id },
    data: data as Prisma.product_reportsUncheckedUpdateInput,
  });
};

export const deleteProductReportService = async (id: number) => {
  return await prisma.product_reports.delete({
    where: { id: id },
  });
};
