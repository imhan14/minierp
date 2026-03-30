import { prisma } from "../../lib/prisma.ts";

export const getProductionLogService = async (filters) => {
  const {} = filters;
  return await prisma.production_logs.findMany({
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
