import { Request, Response } from "express";
import {
  createMaterialReportService,
  getMaterialReportService,
  updateMaterialReportService,
} from "../services/materialReportService";
import { MaterialReportFilters } from "@/types/materialReport.type";

export const createMaterialReport = async (req: Request, res: Response) => {
  const createData = { ...req.body };
  const materialReport = await createMaterialReportService(createData);
  res.status(201).json(materialReport);
};

export const getMaterialReport = async (req: Request, res: Response) => {
  const { role_id, team_id: userTeamId } = req.users!;
  if (role_id === undefined || role_id > 7)
    throw new Error("Your role are not allowed.");
  const { id, search, date, team_id: queryTeamId } = req.query;
  const filters: MaterialReportFilters = {
    id: id ? Number(id) : undefined,
    search: search ? String(search) : undefined,
    date: date ? String(date) : undefined,
    team_id: undefined,
    startDate: req.query.startDate ? String(req.query.startDate) : undefined,
    endDate: req.query.endDate ? String(req.query.endDate) : undefined,
  };
  if (role_id >= 7) filters.team_id = userTeamId;
  else filters.team_id = queryTeamId ? Number(queryTeamId) : undefined;

  const materialReports = await getMaterialReportService(filters);
  res.status(200).json(materialReports);
};

export const updateMaterialReport = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const updateData = { ...req.body };

  const materialReport = await updateMaterialReportService(id, updateData);
  res.status(200).json(materialReport);
};
