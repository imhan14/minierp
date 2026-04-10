import {
  cancelProductOrderService,
  confirmProductOrderService,
  createProductOrderService,
  deleteProductOrderService,
  getProductOrderService,
  updateProductOrderService,
} from "../services/productOderService";

export const createProductOrder = async (req, res) => {
  const { role_id } = req.users;
  const fields = [
    "order_date",
    "formula_id",
    "team_id",
    "product_shift",
    "target_quantity",
    "urea_rate",
    "status",
    "input_temprature_1",
    "input_temprature_2",
    "output_temprature_1",
    "output_temprature_2",
    "order_note",
    "created_by",
  ];
  let createData = {};
  fields.forEach((field) => {
    if (req.body[field] !== undefined) {
      createData[field] = req.body[field];
    }
  });
  if (role_id > 5) throw new Error("Your role are not allowed.");

  const productOrder = await createProductOrderService(createData);
  res.status(201).json(productOrder);
};

export const getProductOrder = async (req, res) => {
  const filters = {
    id: req.query.id ? Number(req.query.id) : undefined,
    date: req.query.date ? req.query.date : undefined,
  };

  const productOrders = await getProductOrderService(filters);
  res.status(200).json(productOrders);
};

export const updateProductOrder = async (req, res) => {
  const id = Number(req.params.id);
  const { role } = req.users;
  const fields = [
    "order_date",
    "formula_id",
    "team_id",
    "product_shift",
    "target_quantity",
    "urea_rate",
    "status",
    "input_temprature_1",
    "input_temprature_2",
    "output_temprature_1",
    "output_temprature_2",
    "order_note",
    "created_by",
  ];
  let updateData = {};
  fields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  });
  if (role > 5) throw new Error("Your role are not allowed.");

  const productOrder = await updateProductOrderService(id, updateData);
  res.status(200).json(productOrder);
};

export const confirmProductOrder = async (req, res) => {
  const id = Number(req.params.id);
  const productOrder = await confirmProductOrderService(id);
  res.status(200).json(productOrder);
};

export const cancelProductOrder = async (req, res) => {
  const id = Number(req.params.id);
  const productOrder = await cancelProductOrderService(id);
  res.status(200).json(productOrder);
};

export const deleteProductOrder = async (req, res) => {
  const id = Number(req.params.id);
  await deleteProductOrderService(id);
  res.status(200).json({ message: "Deleted successful!" });
};
