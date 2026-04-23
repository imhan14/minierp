import dayjs from "dayjs";
import { prisma } from "../../lib/prisma.ts";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import {
  CreateOrderData,
  OrderFilters,
  UpdateOrderData,
} from "@/types/order.type.ts";
import { Prisma } from "../../generated/prisma/client.ts";

dayjs.extend(utc);
dayjs.extend(timezone);

export const createProductOrderService = async (data: CreateOrderData) => {
  return await prisma.product_orders.create({
    data: data,
  });
};

export const getProductOrderService = async (filters: OrderFilters) => {
  const { id, date, search, startDate, endDate } = filters;
  const where: Prisma.product_ordersWhereInput = {};

  if (id) where.id = id;
  if (startDate && endDate)
    where.order_date = {
      gte: dayjs.utc(startDate).startOf("day").toISOString(),
      lte: dayjs.utc(endDate).endOf("day").toISOString(),
    };
  else if (date)
    where.order_date = {
      gte: dayjs.utc(date).startOf("day").toISOString(),
      lte: dayjs.utc(date).endOf("day").toISOString(),
    };

  return await prisma.product_orders.findMany({
    where,
    select: {
      id: true,
      order_date: true,
      formulas: { select: { id: true, formula_name: true } },
      teams: { select: { id: true, team_name: true } },
      product_shift: true,
      target_quantity: true,
      urea_rate: true,
      status: true,
      input_temprature_1: true,
      output_temprature_1: true,
      input_temprature_2: true,
      output_temprature_2: true,
      order_note: true,
      created_at: true,
      created_by: true,
    },
    orderBy: { id: "asc" },
  });
};

export const updateProductOrderService = async (
  id: number,
  data: UpdateOrderData,
) => {
  const currentOrder = await prisma.product_orders.findUnique({
    where: { id },
  });
  if (currentOrder?.status !== "pending")
    throw new Error("The current state does not allow data editing!");
  return await prisma.product_orders.update({
    where: { id: id },
    data: data as Prisma.product_ordersUncheckedUpdateInput,
  });
};

export const confirmProductOrderService = async (id: number) => {
  const currentOrder = await prisma.product_orders.findUnique({
    where: { id },
  });
  if (currentOrder?.status !== "pending")
    throw new Error("The current state does not allow data editing!");
  return await prisma.product_orders.update({
    where: { id },
    data: { status: "ok" },
  });
};

export const cancelProductOrderService = async (id: number) => {
  const currentOrder = await prisma.product_orders.findUnique({
    where: { id },
  });
  if (currentOrder?.status !== "pending")
    throw new Error("The current state does not allow data editing!");
  return await prisma.product_orders.update({
    where: { id },
    data: { status: "cancel" },
  });
};

export const deleteProductOrderService = async (id: number) => {
  return await prisma.product_orders.delete({
    where: { id: id },
  });
};
