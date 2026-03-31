import {
  createProductionLogService,
  getProductionLogService,
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
  const fields = ["team_id", "log_date"];
  let createData = {};
  fields.forEach((field) => {
    if (req.body[field] !== undefined) {
      createData[field] = req.body[field];
    }
  });
  const productionLog = await createProductionLogService(createData);
  res.status(201).json(productionLog);
};
