import { prisma } from "../../lib/prisma.ts";

export const getProductionLogDetailService = async (filters) => {
  const { id, production_log_id } = filters;
  return await prisma.production_log_detail.findMany({
    where: { production_log_id },
    orderBy: { id: "asc" },
  });
};
