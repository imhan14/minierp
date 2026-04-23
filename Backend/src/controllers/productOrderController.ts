import { Request, Response } from "express";
import {
  cancelProductOrderService,
  confirmProductOrderService,
  createProductOrderService,
  deleteProductOrderService,
  getProductOrderService,
  updateProductOrderService,
} from "../services/productOrderService";
import catchAsync from "@/utils/catchAsync";
import {
  CreateOrderData,
  OrderFilters,
  UpdateOrderData,
} from "@/types/order.type";

export const createProductOrder = async (req: Request, res: Response) => {
  const role_id = req.users?.role_id;
  if (!role_id || role_id > 5) {
    return res
      .status(403)
      .json({ message: "Access denied: Your role is not allowed." });
  }
  const { order_date } = req.body;
  const createData: CreateOrderData = {
    ...(order_date && { order_date: new Date(order_date) }),
  };
  const productOrder = await createProductOrderService(createData);
  res.status(201).json(productOrder);
};

export const getProductOrder = async (req: Request, res: Response) => {
  const filters: OrderFilters = {
    id: req.query.id ? Number(req.query.id) : undefined,
    date: req.query.date ? String(req.query.date) : undefined,
    startDate: req.query.startDate ? String(req.query.startDate) : undefined,
    endDate: req.query.endDate ? String(req.query.endDate) : undefined,
  };

  const productOrders = await getProductOrderService(filters);
  res.status(200).json(productOrders);
};

export const updateProductOrder = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const role_id = req.users?.role_id;
  if (!role_id || role_id > 5) {
    return res
      .status(403)
      .json({ message: "Access denied: Your role is not allowed." });
  }
  const {
    order_date,
    formula_id,
    team_id,
    product_shift,
    target_quantity,
    urea_rate,
    status,
    input_temprature_1,
    input_temprature_2,
    output_temprature_1,
    output_temprature_2,
    order_note,
  } = req.body;
  const updateData: UpdateOrderData = {};
  if (order_date) updateData.order_date = order_date;
  if (formula_id) updateData.formula_id = formula_id;
  if (team_id) updateData.team_id = team_id;
  if (product_shift) updateData.product_shift = product_shift;
  if (target_quantity) updateData.target_quantity = target_quantity;
  if (urea_rate) updateData.urea_rate = urea_rate;
  if (status) updateData.status = status;
  if (input_temprature_1) updateData.input_temprature_1 = input_temprature_1;
  if (input_temprature_2) updateData.input_temprature_2 = input_temprature_2;
  if (output_temprature_1) updateData.output_temprature_1 = output_temprature_1;
  if (output_temprature_2) updateData.output_temprature_2 = output_temprature_2;
  if (order_note) updateData.order_note = order_note;

  const productOrder = await updateProductOrderService(id, updateData);
  res.status(200).json(productOrder);
};

export const confirmProductOrder = catchAsync(
  async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const productOrder = await confirmProductOrderService(id);
    res.status(200).json(productOrder);
  },
);

export const cancelProductOrder = catchAsync(
  async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const productOrder = await cancelProductOrderService(id);
    res.status(200).json(productOrder);
  },
);

export const deleteProductOrder = catchAsync(
  async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    await deleteProductOrderService(id);
    res.status(200).json({ message: "Deleted successful!" });
  },
);
