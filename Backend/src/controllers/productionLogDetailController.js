import { getProductionLogDetailService } from "../services/productionLogDetailService";

export const getProductionLogDetail = async (req, res) => {
  const filters = {
    id: req.query.id ? Number(req.query.id) : undefined,
    production_log_id: production_log_id
      ? Number(production_log_id)
      : undefined,
  };
  const productionLogDetail = await getProductionLogDetailService(filters);
  res.status(200).json(productionLogDetail);
};
