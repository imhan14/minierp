import dayjs from "dayjs";
import { prisma } from "../../lib/prisma.ts";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export const getProductionLogService = async (filters) => {
  const { id, date, team_id, startDate, endDate } = filters;
  const where = {};

  if (id) where.id = id;
  if (startDate && endDate)
    where.log_date = {
      gte: dayjs.utc(startDate).startOf("day").toISOString(),
      lte: dayjs.utc(endDate).endOf("day").toISOString(),
    };
  else if (date)
    where.log_date = {
      gte: dayjs.utc(date).startOf("day").toISOString(),
      lte: dayjs.utc(date).endOf("day").toISOString(),
    };
  if (team_id) where.team_id = team_id;

  return await prisma.production_logs.findMany({
    where,
    select: {
      id: true,
      number_of_employee: true,
      on_work: true,
      unauthorized_absence: true,
      authorized_absence: true,
      ht_di: true,
      ht_den: true,
      forklift: true,
      shift_leader: true,
      extral_logs: true,
      electric_production: true,
      electric_mix: true,
      log_date: true,
      log_start: true,
      log_end: true,
      teams: {
        select: {
          team_name: true,
          id: true,
        },
      },
    },
    orderBy: { id: "asc" },
  });
};

export const createProductionLogService = async (data) => {
  return await prisma.production_logs.create({
    data: data,
  });
};

export const updateProductionLogService = async (id, data) => {
  const existingReport = await prisma.production_logs.findUnique({
    where: { id: id },
  });

  if (!existingReport) throw new Error("Report không tồn tại");
  return await prisma.production_logs.update({
    where: { id: id },
    data: data,
  });
};
