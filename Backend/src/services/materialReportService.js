import { prisma } from "../../lib/prisma.ts";

export const getMaterialReportService = async (filters) => {
  const { id } = filters;
  return await prisma.material_reports.findMany({
    where: id,
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
  });
};

export const createMaterialReportService = async (data) => {
  return await prisma.material_reports.create({
    data: {
      report_date: data.report_date,
      shift: data.shift,
      team_id: data.team_id,
      foreman_check: data.foreman_check,
      start_time: data.start_time,
      end_time: data.end_time,
      extral_materials: data.extral_materials,
      material_details:
        data.details && data.details.length > 0
          ? {
              create: data.details.map((item) => ({
                ingredient_id: item.ingredient_id,
                weight: item.weight,
                real_percent: item.real_percent,
                note: item.note,
              })),
            }
          : undefined,
    },
  });
};

export const updateMaterialReportService = async (id, data) => {
  return await prisma.material_reports.update({
    where: { id: id },
    data: data,
  });
};
