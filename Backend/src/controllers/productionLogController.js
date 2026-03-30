import { getProductionLogService } from "../services/productionLogService";

export const getProductionLog = async (req, res) => {
  const filters = {
    id: req.query.id ? Number(req.query.id) : undefined,
  };
  const productionLog = await getProductionLogService(filters);
  res.status(200).json(productionLog);
};
