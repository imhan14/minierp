import {
  createProductionLogService,
  getProductionLogService,
  updateProductionLogService,
} from "../services/productionLogService";

export const getProductionLog = async (req, res) => {
  const filters = {
    id: req.query.id ? Number(req.query.id) : undefined,
    date: req.query.date ? req.query.date : undefined,
  };
  const productionLog = await getProductionLogService(filters);
  res.status(200).json(productionLog);
};

export const createProductionLog = async (req, res) => {
  const fields = [
    "team_id",
    "log_date",
    "log_date",
    "team_id",
    "electric_production",
    "electric_mix",
    "log_start",
    "log_end",
    "number_of_employee",
    "on_work",
    "unauthorized_absence",
    "authorized_absence",
    "ht_di",
    "ht_den",
    "forklift",
    "shift_leader",
  ];
  let createData = {};
  fields.forEach((field) => {
    if (req.body[field] !== undefined) {
      createData[field] = req.body[field];
    }
  });
  const productionLog = await createProductionLogService(createData);
  res.status(201).json(productionLog);
};

export const updateProductionLog = async (req, res) => {
  const id = Number(req.params.id);
  const fields = ["team_id", "log_date"];
  let updateData = {};
  fields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  });
  const productionLog = await updateProductionLogService(id, updateData);
  res.status(200).json(productionLog);
};
