import {
  createFormulaDetailService,
  getFormulaDetailService,
} from "../services/formulaDetailService";

export const getFormulaDetail = async (req, res) => {
  const filters = {
    formula_id: req.query.formula_id ? Number(req.query.formula_id) : undefined,
  };
  const formulaDetail = await getFormulaDetailService(filters);
  res.status(200).json(formulaDetail);
};

export const createFormulaDetail = async (req, res) => {
  const fields = ["formula_id", "ingredient_id", "standard_quality"];
  let createData = {};
  fields.forEach((field) => {
    if (req.body[field] !== undefined) {
      createData[field] = req.body[field];
    }
  });
  const formulaDetail = await createFormulaDetailService(createData);
  res.status(201).json(formulaDetail);
};

export const updateFormulaDetail = async (req, res) => {
  const fields = ["formula_id", "ingredient_id", "standard_quality"];
  let updateData = {};
  fields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  });
  const formulaDetail = await createFormulaDetailService(
    Number(req.params.id),
    updateData,
  );
  res.status(200).json(formulaDetail);
};
