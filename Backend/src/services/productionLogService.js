import dayjs from "dayjs";
import { prisma } from "../../lib/prisma.ts";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export const getProductionLogService = async (filters) => {
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
  return await prisma.production_logs.findMany({
    where: {
      ...(id && { id: id }),
      ...(date && { log_date: dateFilter }),
    },
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
  return await prisma.production_logs.update({
    where: { id },
    data: { data },
  });
};
