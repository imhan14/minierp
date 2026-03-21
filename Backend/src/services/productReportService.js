import dayjs from "dayjs";
import { prisma } from "../../lib/prisma.ts";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export const createProductReportService = async (data) => {
  return await prisma.product_reports.create({
    data: data,
  });
};

export const getProductReportService = async (filters) => {
  const { id, date } = filters;
  let dateFilter = {};
  if (date) {
    const startOfDay = dayjs.utc(date).startOf("day").toISOString();
    const endOfDay = dayjs.utc(date).endOf("day").toISOString();
    dateFilter = {
      gte: startOfDay,
      lte: endOfDay,
    };
  }
  return await prisma.product_reports.findMany({
    where: {
      ...(id && { id: id }),
      ...(date && { report_date: dateFilter }),
    },
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

export const updateProductReportService = async (id, data) => {
  return await prisma.product_reports.update({
    where: { id: id },
    data: data,
  });
};

export const deleteProductReportService = async (id) => {
  return await prisma.product_reports.delete({
    where: { id: id },
  });
};
