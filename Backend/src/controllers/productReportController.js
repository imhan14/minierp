import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
import {
  createProductReportService,
  deleteProductReportService,
  getProductReportService,
  updateProductReportService,
} from "../services/productReportService";

export const createProductReport = async (req, res) => {
  const { role } = req.users;
  console.log(req.users);
  const fields = ["team_id", "report_date"];
  let createData = {};
  fields.forEach((field) => {
    if (req.body[field] !== undefined) {
      createData[field] = req.body[field];
    }
  });
  if (role > 7) throw new Error("Your role are not allowed.");
  const productReport = await createProductReportService(createData);
  res.status(201).json(productReport);
};

export const getProductReport = async (req, res) => {
  const { role, team_id: userTeamId } = req.users;
  const { id, search, date, team_id: queryTeamId } = req.query;
  const filters = {
    id: id ? Number(id) : undefined,
    search: search ? search : undefined,
    date: date ? date : undefined,
    team_id: undefined,
  };
  if (role >= 7) filters.team_id = Number(userTeamId);
  else filters.team_id = queryTeamId ? Number(queryTeamId) : undefined;

  const productReports = await getProductReportService(filters);
  res.status(200).json(productReports);
};

export const updateProductReport = async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) throw new Error("Invalid id.");
  const productReport = await updateProductReportService(id, req.body);
  res.status(200).json(productReport);
};

export const deleteProductReport = async (req, res) => {
  const id = Number(req.params.id);
  await deleteProductReportService(id);
  res.status(200).json({ message: "Deleted Successful!" });
};
