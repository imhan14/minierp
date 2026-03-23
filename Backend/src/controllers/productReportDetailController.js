import {
  createProductReportDetailService,
  getProductReportDetailSercive,
} from "../services/productReportDetailService";

export const getProductReportDetail = async (req, res) => {
  const filters = {
    id: req.query.id ? Number(req.query.id) : undefined,
  };
  const productReportDetails = await getProductReportDetailSercive(filters);
  res.status(200).json(productReportDetails);
};

export const createProductReportDetail = async (req, res) => {
  const productReportDetail = await createProductReportDetailService();
  res.status(201).json(productReportDetail);
};
