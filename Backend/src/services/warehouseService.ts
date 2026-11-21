import { Prisma } from "../../generated/prisma/client.ts";
import type { warehouse_transaction_type } from "../../generated/prisma/client.ts";
import { prisma } from "../../lib/prisma.ts";

export interface CreateWarehouseTransactionData {
  product_type: string;
  transaction_type: "inbound" | "outbound";
  quantity: number;
  note?: string | null;
}

export const getWarehouseInventoryService = async () => {
  const [productionTotals, transactionTotals] = await Promise.all([
    prisma.production_log_detail.groupBy({
      by: ["product_type"],
      where: { task_type: "production", product_type: { not: null } },
      _sum: { quantity: true },
    }),
    prisma.warehouse_transactions.groupBy({
      by: ["product_type", "transaction_type"],
      _sum: { quantity: true },
    }),
  ]);

  const stockByProductType = new Map<
    string,
    { produced_quantity: number; inbound_quantity: number; outbound_quantity: number }
  >();
  for (const total of productionTotals) {
    if (!total.product_type) continue;
    const stock = stockByProductType.get(total.product_type) ?? {
      produced_quantity: 0,
      inbound_quantity: 0,
      outbound_quantity: 0,
    };
    stock.produced_quantity = Number(total._sum.quantity ?? 0);
    stockByProductType.set(total.product_type, stock);
  }
  for (const total of transactionTotals) {
    const stock = stockByProductType.get(total.product_type) ?? {
      produced_quantity: 0,
      inbound_quantity: 0,
      outbound_quantity: 0,
    };
    const quantity = Number(total._sum.quantity ?? 0);
    if (total.transaction_type === "inbound") stock.inbound_quantity += quantity;
    else stock.outbound_quantity += quantity;
    stockByProductType.set(total.product_type, stock);
  }

  return Array.from(stockByProductType, ([product_type, stock]) => ({
    product_type,
    ...stock,
    stock_quantity:
      stock.produced_quantity + stock.inbound_quantity - stock.outbound_quantity,
  })).sort((a, b) => a.product_type.localeCompare(b.product_type));
};

export const getWarehouseTransactionsService = async () =>
  prisma.warehouse_transactions.findMany({
    orderBy: [{ created_at: "desc" }, { id: "desc" }],
    take: 200,
  });

export const createWarehouseTransactionService = async (
  data: CreateWarehouseTransactionData,
  userId: number,
) =>
  prisma.$transaction(
    async (tx) => {
      if (data.transaction_type === "outbound") {
        const [productionTotals, transactionTotals] = await Promise.all([
          tx.production_log_detail.groupBy({
            by: ["product_type"],
            where: {
              product_type: data.product_type,
              task_type: "production",
            },
            _sum: { quantity: true },
          }),
          tx.warehouse_transactions.groupBy({
          by: ["transaction_type"],
            where: { product_type: data.product_type },
          _sum: { quantity: true },
          }),
        ]);
        const produced = Number(productionTotals[0]?._sum.quantity ?? 0);
        const ledgerBalance = transactionTotals.reduce((balance, total) => {
          const quantity = total._sum.quantity ?? 0;
          return balance +
            (total.transaction_type === "inbound"
              ? Number(quantity)
              : -Number(quantity));
        }, 0);
        const stock = produced + ledgerBalance;

        if (data.quantity > stock) {
          throw Object.assign(
            new Error(`Tồn kho không đủ. Số lượng hiện có: ${stock}.`),
            { statusCode: 400 },
          );
        }
      }

      return tx.warehouse_transactions.create({
        data: {
          product_type: data.product_type,
          transaction_type: data.transaction_type as warehouse_transaction_type,
          quantity: data.quantity,
          note: data.note || null,
          created_by: userId,
        },
      });
    },
    { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
  );
