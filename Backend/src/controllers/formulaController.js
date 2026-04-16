import {
  createFormulaService,
  getAllFormlasService,
  updateFormulaService,
} from "../services/formulaService";

export const getAllFomulas = async (req, res) => {
  const filters = {
    id: req.query.id ? Number(req.query.id) : undefined,
    search: req.query.search ? String(req.query.search) : undefined,
    active:
      req.query.active === "true"
        ? true
        : req.query.active === "false"
          ? false
          : undefined,
    line: req.query.line ?? undefined,
    specification: req.query.specification ?? undefined,
    color: req.query.color ?? undefined,
    typeOfSpecification: req.query.typeOfSpecification ?? undefined,
    orderBy: req.query.orderBy || undefined,
  };
  const formulas = await getAllFormlasService(filters);
  res.status(200).json(formulas);
};

export const createFormula = async (req, res) => {
  const newFormula = await createFormulaService();
  res.status(201).json(newFormula);
};

export const updateFormula = async (req, res) => {
  const id = Number(req.params.id);
  const fields = [
    "formula_code",
    "formula_name",
    "product_id",
    "is_active",
    "product_line",
    "specification",
    "color",
    "type_of_specification",
  ];
  let updateData = {};
  fields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  });
  const formula = await updateFormulaService(id, updateData);
  res.status(200).json(formula);
};
