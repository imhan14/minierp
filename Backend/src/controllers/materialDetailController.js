import { createMaterialDetailsService } from "../services/materialDetailService";

export const createMaterialDetails = async (req, res) => {
  const materialDetails = await createMaterialDetailsService(req.body);
  res.status(201).json(materialDetails);
};
