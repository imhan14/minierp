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
  var fields = ["team_id", "report_date"];
  let createData = {};
  fields.forEach((field) => {
    if (req.body[field] !== undefined) {
      createData[field] = req.body[field];
    }
  });
  const productReport = await createProductReportService(createData);
  res.status(201).json(productReport);
};

export const getProductReport = async (req, res) => {
  const filters = {
    id: req.query.id ? Number(req.query.id) : undefined,
    search: req.query.search,
    date: req.query.date ? req.query.date : undefined,
  };

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
