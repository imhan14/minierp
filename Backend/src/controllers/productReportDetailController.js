import {
  createProductReportDetailService,
  deleteProductReportDetailService,
  getProductReportDetailSercive,
  updateProductReportDetailService,
} from "../services/productReportDetailService";

export const getProductReportDetail = async (req, res) => {
  const filters = {
    id: req.query.id ? Number(req.query.id) : undefined,
    report_id: req.query.report_id ? Number(req.query.report_id) : undefined,
  };
  const productReportDetails = await getProductReportDetailSercive(filters);
  res.status(200).json(productReportDetails);
};

export const createProductReportDetail = async (req, res) => {
  const fields = [
    "product_id",
    "report_id",
    "is_finish",
    "type_of_specification",
    "product_line",
    "specification",
    "start_time",
    "end_time",
    "weight",
    "note",
  ];
  let createData = {};
  fields.forEach((field) => {
    if (req.body[field] !== undefined) {
      createData[field] = req.body[field];
    }
  });
  const productReportDetail =
    await createProductReportDetailService(createData);
  res.status(201).json(productReportDetail);
};

export const updateProductReportDetail = async (req, res) => {
  const id = Number(req.params.id);
  const fields = [
    "product_id",
    "report_id",
    "is_finish",
    "type_of_specification",
    "product_line",
    "specification",
    "start_time",
    "end_time",
    "weight",
    "note",
  ];
  let updateData = {};
  fields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  });
  const productReportDetail = await updateProductReportDetailService(
    id,
    updateData,
  );
  res.status(200).json(productReportDetail);
};

export const deleteProductReportDetail = async (req, res) => {
  const id = Number(req.params.id);
  await deleteProductReportDetailService(id);
  res.status(200).json({ message: "Deleted successful!" });
};
