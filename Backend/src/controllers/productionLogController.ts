import { Request, Response } from "express";
import {
  CreateProductLogData,
  ProductionLogFilters,
  UpdateProductLogData,
} from "@/types/productionLog.type";
import {
  createProductionLogService,
  getProductionLogService,
  updateProductionLogService,
} from "../services/productionLogService";

export const getProductionLog = async (req: Request, res: Response) => {
  const { role_id, team_id: userTeamId } = req.users!;
  if (role_id === undefined || role_id > 7)
    throw new Error("Your role are not allowed.");
  const filters: ProductionLogFilters = {
    id: req.query.id ? Number(req.query.id) : undefined,
    date: req.query.date ? String(req.query.date) : undefined,
    team_id: undefined,
    startDate: req.query.startDate ? String(req.query.startDate) : undefined,
    endDate: req.query.endDate ? String(req.query.endDate) : undefined,
  };
  if (role_id >= 7) filters.team_id = userTeamId;
  else filters.team_id = req.query.req ? Number(req.query.req) : undefined;

  const productionLog = await getProductionLogService(filters);
  res.status(200).json(productionLog);
};

export const createProductionLog = async (req: Request, res: Response) => {
  let createData: CreateProductLogData = { ...req.body };

  const productionLog = await createProductionLogService(createData);
  res.status(201).json(productionLog);
};

export const updateProductionLog = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const updateData: UpdateProductLogData = { ...req.body };

  const productionLog = await updateProductionLogService(id, updateData);
  res.status(200).json(productionLog);
};
