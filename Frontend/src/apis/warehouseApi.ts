import instance from "@/apis/axios";

export interface WarehouseInventoryItem {
  product_type: string;
  produced_quantity: number;
  inbound_quantity: number;
  outbound_quantity: number;
  stock_quantity: number;
}

export interface WarehouseTransaction {
  id: number;
  product_type: string;
  transaction_type: "inbound" | "outbound";
  quantity: number;
  note: string | null;
  created_at: string;
}

export interface CreateWarehouseTransaction {
  product_type: string;
  transaction_type: "inbound" | "outbound";
  quantity: number;
  note?: string;
}

const warehouseApi = {
  getInventory: async () => {
    const response = await instance.get<WarehouseInventoryItem[]>(
      "/warehouse/inventory",
    );
    return response.data;
  },
  getTransactions: async () => {
    const response = await instance.get<WarehouseTransaction[]>(
      "/warehouse/transactions",
    );
    return response.data;
  },
  createTransaction: async (data: CreateWarehouseTransaction) => {
    const response = await instance.post<WarehouseTransaction>(
      "/warehouse/transactions",
      data,
    );
    return response.data;
  },
};

export default warehouseApi;
