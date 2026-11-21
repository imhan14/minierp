import { useCallback, useEffect, useState, type FormEvent } from "react";
import dayjs from "dayjs";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import warehouseApi, {
  type WarehouseInventoryItem,
  type WarehouseTransaction,
} from "@/apis/warehouseApi";
import { DrawerHeader } from "@/utils/others";
import { useNotify } from "@/hooks/useNotify";
import {
  getProductionProductTypeLabel,
  PRODUCTION_PRODUCT_TYPES,
} from "@/pages/productionLog/utils/productTypes";

const WarehousePage = () => {
  const notify = useNotify();
  const [inventory, setInventory] = useState<WarehouseInventoryItem[]>([]);
  const [transactions, setTransactions] = useState<WarehouseTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [productType, setProductType] = useState(
    PRODUCTION_PRODUCT_TYPES[0]?.value ?? "",
  );
  const [transactionType, setTransactionType] = useState<
    "inbound" | "outbound"
  >("inbound");
  const [quantity, setQuantity] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const productTypes = Array.from(
    new Set([
      ...PRODUCTION_PRODUCT_TYPES.map((item) => item.value),
      ...inventory.map((item) => item.product_type),
    ]),
  );

  const loadWarehouse = useCallback(async () => {
    setLoading(true);
    try {
      const [items, movements] = await Promise.all([
        warehouseApi.getInventory(),
        warehouseApi.getTransactions(),
      ]);
      const inventoryByType = new Map(
        items.map((item) => [item.product_type, item]),
      );
      const allProductTypes = new Set([
        ...PRODUCTION_PRODUCT_TYPES.map((item) => item.value),
        ...items.map((item) => item.product_type),
      ]);
      setInventory(
        Array.from(allProductTypes, (type) =>
          inventoryByType.get(type) ?? {
            product_type: type,
            produced_quantity: 0,
            inbound_quantity: 0,
            outbound_quantity: 0,
            stock_quantity: 0,
          },
        ),
      );
      setTransactions(movements);
      setProductType(
        (current) => current || items[0]?.product_type || PRODUCTION_PRODUCT_TYPES[0]?.value || "",
      );
      setError("");
    } catch (loadError) {
      const responseError = loadError as {
        response?: { data?: { error?: string; message?: string } };
      };
      setError(
        responseError.response?.data?.message ||
          responseError.response?.data?.error ||
          "Không tải được dữ liệu kho.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadWarehouse();
  }, [loadWarehouse]);

  const handleSubmitTransaction = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const amount = Number(quantity);
    if (!productType || !Number.isFinite(amount) || amount <= 0) {
      setError("Vui lòng chọn sản phẩm và nhập số lượng lớn hơn 0.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      await warehouseApi.createTransaction({
        product_type: productType,
        transaction_type: transactionType,
        quantity: amount,
        note: note.trim() || undefined,
      });
      setQuantity("");
      setNote("");
      await loadWarehouse();
      notify(
        transactionType === "inbound"
          ? "Đã ghi nhận nhập kho."
          : "Đã ghi nhận xuất kho.",
        "success",
      );
    } catch (submitError) {
      const responseError = submitError as {
        response?: { data?: { error?: string; message?: string } };
      };
      setError(
        responseError.response?.data?.message ||
          responseError.response?.data?.error ||
          "Không lưu được phiếu kho.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box>
      <DrawerHeader />
      <Typography variant="h4" sx={{ mb: 2 }}>
        Warehouse
      </Typography>
      <Paper sx={{ mb: 2 }}>
        <Tabs
          value={activeTab}
          onChange={(_, value: number) => setActiveTab(value)}
          aria-label="Warehouse sections"
        >
          <Tab label="Tồn kho" />
          <Tab label="Nhập / xuất hàng" />
        </Tabs>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
          <CircularProgress />
        </Box>
      ) : activeTab === 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Loại thành phẩm</TableCell>
                <TableCell align="right">Đã sản xuất</TableCell>
                <TableCell align="right">Nhập thêm</TableCell>
                <TableCell align="right">Tồn kho</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inventory.map((item) => (
                <TableRow key={item.product_type} hover>
                  <TableCell>
                    {getProductionProductTypeLabel(item.product_type)} ({item.product_type})
                  </TableCell>
                  <TableCell align="right">
                    {item.produced_quantity.toLocaleString()}
                  </TableCell>
                  <TableCell align="right">
                    {item.inbound_quantity.toLocaleString()}
                  </TableCell>
                  <TableCell align="right">
                    {item.stock_quantity.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
              {inventory.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    Chưa có thành phẩm được ghi nhận từ Production Log.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Box sx={{ display: "grid", gap: 2 }}>
          <Paper
            component="form"
            onSubmit={handleSubmitTransaction}
            sx={{ p: 2, display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "repeat(4, 1fr)" } }}
          >
            <TextField
              select
              required
              label="Sản phẩm"
              value={productType}
              onChange={(event) => setProductType(event.target.value)}
              disabled={productTypes.length === 0}
            >
              {productTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {getProductionProductTypeLabel(type)} ({type})
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Loại phiếu"
              value={transactionType}
              onChange={(event) =>
                setTransactionType(event.target.value as "inbound" | "outbound")
              }
            >
              <MenuItem value="inbound">Nhập kho</MenuItem>
              <MenuItem value="outbound">Xuất kho</MenuItem>
            </TextField>
            <TextField
              required
              type="number"
              label="Số lượng"
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
              slotProps={{ htmlInput: { min: 0.0001, step: "any" } }}
            />
            <TextField
              label="Ghi chú"
              value={note}
              onChange={(event) => setNote(event.target.value)}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={submitting || productTypes.length === 0}
              sx={{ gridColumn: { md: "1 / -1" }, justifySelf: "start" }}
            >
              {submitting
                ? "Đang lưu..."
                : transactionType === "inbound"
                  ? "Ghi nhận nhập kho"
                  : "Ghi nhận xuất kho"}
            </Button>
          </Paper>

          <Typography variant="h6">Lịch sử nhập / xuất gần đây</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Thời gian</TableCell>
                  <TableCell>Sản phẩm</TableCell>
                  <TableCell>Loại phiếu</TableCell>
                  <TableCell align="right">Số lượng</TableCell>
                  <TableCell>Ghi chú</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id} hover>
                    <TableCell>
                      {dayjs(transaction.created_at).format("DD/MM/YYYY HH:mm")}
                    </TableCell>
                    <TableCell>
                      {getProductionProductTypeLabel(transaction.product_type)} ({transaction.product_type})
                    </TableCell>
                    <TableCell>
                      {transaction.transaction_type === "inbound" ? "Nhập kho" : "Xuất kho"}
                    </TableCell>
                    <TableCell align="right">
                      {transaction.quantity.toLocaleString()}
                    </TableCell>
                    <TableCell>{transaction.note || "-"}</TableCell>
                  </TableRow>
                ))}
                {transactions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      Chưa có giao dịch nhập / xuất.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Box>
  );
};

export default WarehousePage;
