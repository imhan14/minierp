import { Request, Response } from "express";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
import {
  createProductReportService,
  deleteProductReportService,
  getProductReportService,
  updateProductReportService,
} from "../services/productReportService";
import catchAsync from "@/utils/catchAsync";
import {
  CreateProductReportData,
  ProductReportFilters,
} from "@/types/productReport.type";

export const createProductReport = catchAsync(
  async (req: Request, res: Response) => {
    const role_id = req.users?.role_id;
    if (role_id === undefined || role_id > 7)
      throw new Error("Your role are not allowed.");

    const { team_id, report_date } = req.body;
    let createData: CreateProductReportData = { report_date };
    if (team_id !== undefined) createData.team_id = Number(team_id);

    const productReport = await createProductReportService(createData);
    res.status(201).json(productReport);
  },
);

export const getProductReport = catchAsync(
  async (req: Request, res: Response) => {
    const { role_id, team_id: userTeamId } = req.users!;
    const { id, search, date, team_id: queryTeamId } = req.query;
    const filters: ProductReportFilters = {
      id: Number(id) ?? undefined,
      search: search as string | undefined,
      date: date as string | undefined,
      team_id: undefined,
      startDate: req.query.startDate as string | undefined,
      endDate: req.query.endDate as string | undefined,
    };
    if (role_id >= 7) filters.team_id = Number(userTeamId);
    else filters.team_id = queryTeamId ? Number(queryTeamId) : undefined;

    const productReports = await getProductReportService(filters);
    res.status(200).json(productReports);
  },
);

export const updateProductReport = catchAsync(
  async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (isNaN(id)) throw new Error("Invalid id.");
    const productReport = await updateProductReportService(id, req.body);
    res.status(200).json(productReport);
  },
);

export const deleteProductReport = catchAsync(
  async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    await deleteProductReportService(id);
    res.status(200).json({ message: "Deleted Successful!" });
  },
);
