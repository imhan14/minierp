import {
  createProductionLogDetailService,
  deleteProductionDetailService,
  getProductionLogDetailService,
  updateProductionLogDetailService,
} from "../services/productionLogDetailService";

export const getProductionLogDetail = async (req, res) => {
  const filters = {
    id: req.query.id ? Number(req.query.id) : undefined,
    production_log_id: req.query.production_log_id
      ? Number(req.query.production_log_id)
      : undefined,
  };
  const productionLogDetail = await getProductionLogDetailService(filters);
  res.status(200).json(productionLogDetail);
};

export const createProductionLogDetail = async (req, res) => {
  const fields = [
    "production_log_id",
    "start_time",
    "end_time",
    "task_type",
    "content",
    "quantity",
    "product_type",
    "pkg_received",
    "pkg_returned",
    "pkg_damaged",
  ];
  let createData = {};
  fields.forEach((field) => {
    if (req.body[field] !== undefined) {
      createData[field] = req.body[field];
    }
  });
  const productLogDetail = await createProductionLogDetailService(createData);
  res.status(201).json(productLogDetail);
};

export const updateProductionLogDetail = async (req, res) => {
  const id = Number(req.params.id);
  const fields = [
    "production_log_id",
    "start_time",
    "end_time",
    "task_type",
    "content",
    "quantity",
    "product_type",
    "pkg_received",
    "pkg_returned",
    "pkg_damaged",
  ];
  let updateData = {};
  fields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  });
  const productLogDetail = await updateProductionLogDetailService(
    id,
    updateData,
  );
  res.status(200).json(productLogDetail);
};

export const deleteProductionLogDetail = async (req, res) => {
  const id = Number(req.params.id);
  await deleteProductionDetailService(id);
  res.status(200).json({ message: "Deleted successful!" });
};
