import dayjs from "dayjs";
import { prisma } from "../../lib/prisma.ts";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export const getMaterialReportService = async (filters) => {
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
  return await prisma.material_reports.findMany({
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
      report_date: true,
      shift: true,
      extral_materials: true,
      foreman_check: true,
      start_time: true,
      end_time: true,
    },
    orderBy: { id: "asc" },
  });
};

export const createMaterialReportService = async (data) => {
  return await prisma.material_reports.create({
    data: data,
  });
};

export const updateMaterialReportService = async (id, data) => {
  const existingReport = await prisma.material_reports.findUnique({
    where: { id: id },
  });

  if (!existingReport) throw new Error("Report không tồn tại");
  return await prisma.material_reports.update({
    where: { id: id },
    data: data,
  });
};

export const deleteMaterialReportService = async (id) => {};
