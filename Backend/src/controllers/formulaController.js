import { getAllFormlasService } from "../services/formulaService";

export const getAllFomulas = async (req, res) => {
  const filters = {
    id: req.query.id ? Number(req.query.id) : undefined,
  };
  const formulas = await getAllFormlasService(filters);
  res.status(200).json(formulas);
};
