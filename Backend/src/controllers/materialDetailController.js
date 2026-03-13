import {
  createMaterialDetailsService,
  getMaterialDetailService,
} from "../services/materialDetailService";

export const createMaterialDetails = async (req, res) => {
  const materialDetails = await createMaterialDetailsService(req.body);
  res.status(201).json(materialDetails);
};

export const getMaterialDetail = async (req, res) => {
  const filters = {
    material_id: req.query.material_id
      ? Number(req.query.material_id)
      : undefined,
  };
  const materialDetails = await getMaterialDetailService(filters);
  res.status(200).json(materialDetails);
};
