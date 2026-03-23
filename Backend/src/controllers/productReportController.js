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
  // const data = {};
  // if(req.body.report_date) data.report_date = dayjs(req.body.report_date, "DD-MM-YYYY").toDate();
  // if(req.body.team_id) data.team_id = Number(req.body.team_id)
  // if(req.body.furnace) data.furnace = Number(req.body.furnace)
  // if(req.body.shift) data.shift = req.body.shift
  // if(req.body.start_time) data.start_time = dayjs(req.body.start_time, "DD-MM-YYYY HH:mm").toDate();
  // if(req.body.end_time) data.end_time =dayjs(req.body.end_time, "DD-MM-YYYY HH:mm").toDate();

  const productReport = await updateProductReportService(id, req.body);
  res.status(200).json(productReport);
};

export const deleteProductReport = async (req, res) => {
  const id = Number(req.params.id);
  await deleteProductReportService(id);
  res.status(200).json({ message: "Deleted Successful!" });
};
