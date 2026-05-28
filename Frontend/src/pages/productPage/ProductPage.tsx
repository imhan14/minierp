import { Box, Button, styled } from "@mui/material";
import { useMemo } from "react";
import DataTable, { type ActionConfig } from "@/components/DataTable";
import { getFieldConfigs } from "@/utils/schema-parser";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useEntity } from "@/hooks/useEntity";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { ConfirmDiscardDialog } from "@/components/ConfirmDiscardDialog";
import type { FieldConfig } from "@/types/FieldConfig";
import GeneralInfoSection from "@/components/GeneralInfoSection";
import DynamicPopup from "@/components/DynamicPopup";
import productionApi, { type ProductFilters } from "@/apis/productionApi";
import { usePageForm } from "@/hooks/usePageForm";
import {
  CreateProductSchema,
  ProductSchema,
  UpdateProductSchema,
  type ProductCreatePayload,
  type ProductType,
  type ProductUpdatePayload,
} from "@/schema/product.schema";
import ProductFilterUI from "./components/ProductFilterUI";

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));
const FIELD_WIDTHS: Partial<Record<string, number>> = {
  product_code: 100,
  product_name: 300,
  unit: 100,
};
const ProductPage = () => {
  const { data: products, reload } = useEntity<
    ProductType,
    ProductType,
    ProductFilters
  >(productionApi.getAllProducts);
  const {
    form,
    confirmOpen,
    handleDiscard,
    handleContinueEditing,
    guardAction,
    setConfirmOpen,
  } = usePageForm<ProductType, ProductCreatePayload, ProductUpdatePayload>({
    service: {
      create: productionApi.createProduct,
      update: productionApi.updateProduct,
      // delete: productionReportApi.deleteProductionLog,
    },
    createSchema: CreateProductSchema,
    updateSchema: UpdateProductSchema,
    defaultValues: {},
    messages: {
      createSuccess: "Thêm sản phẩm thành công!",
      updateSuccess: "Cập nhật thành công!",
    },

    onSuccess: reload,
  });
  const productConfigs = useMemo(() => getFieldConfigs(ProductSchema), []);
  const dialogFields = useMemo((): FieldConfig<ProductType>[] => {
    return productConfigs
      .filter((f) => f.formOrder !== false && f.name !== "id")
      .map((f) => ({
        id: f.name as keyof ProductType,
        label: f.label,
        inputType: f.type ?? "text",
        options: f.options,
        gridSize: f.name === "description" ? { xs: 12 } : { xs: 12, sm: 6 },
        isReadOnly: false,
        required: f.isRequired,
      }));
  }, [productConfigs]);
  // ── Columns cho DataTable ──────────────────────────────────────────────────
  const columns = useMemo(() => {
    const dynamicColumns = productConfigs
      .filter((f) => f.tableVisible)
      .map((f) => ({
        id: f.name as keyof ProductType | "actions",
        label: f.label,
        width: FIELD_WIDTHS[f.name],
        align: (f.type === "number" ? "right" : "left") as "right" | "left",
        render: (value: unknown) => {
          if (f.type === "number") return value?.toLocaleString() || "0";
          return value !== null && value !== undefined ? String(value) : "-";
        },
      }));

    return [
      ...dynamicColumns,
      {
        id: "actions",
        label: "Thao tác",
      },
    ];
  }, [productConfigs]);

  //____actions_______________________________________________________
  const actions = (): ActionConfig<ProductType>[] => {
    return [
      {
        label: "Sửa",
        color: "primary",
        icon: <EditOutlinedIcon />,
        onClick: (row) => guardAction(() => form.openEdit(row)),
      },
      {
        label: "Xóa",
        icon: <DeleteOutlineIcon fontSize="small" />,
        color: "error",
        onClick: (row) =>
          guardAction(() =>
            form.deleteRecord(row, `Xóa sản phẩm "${row.product_name}"?`),
          ),
      },
    ];
  };
  return (
    <>
      <DrawerHeader />
      <ProductFilterUI onFilterChange={(newFilters) => reload(newFilters)} />
      <Box>
        <Button
          variant="contained"
          sx={{ marginBottom: 1 }}
          onClick={() => guardAction(form.openAdd)}
        >
          Add new Product
        </Button>
        <DataTable
          columns={columns}
          data={products}
          actions={actions}
          getRowKey={(row) => row.id}
        />

        <DynamicPopup
          open={form.isOpen}
          onClose={() => guardAction(form.close)}
          title={
            form.mode === "add" ? "Thêm sản phẩm mới" : "Chỉnh sửa sản phẩm"
          }
          mode={form.mode === "idle" ? undefined : form.mode}
          onSubmit={form.submit}
          isSubmitting={form.isSubmitting}
          maxWidth="sm"
        >
          <GeneralInfoSection<ProductType>
            mode="form"
            displayFields={dialogFields}
            data={form.formData as ProductType}
            onGeneralChange={(id, value) => form.setField(id, value)}
            errors={
              form.fieldErrors as Partial<Record<keyof ProductType, string>>
            }
            disabledFields={{
              product_code: form.mode === "edit",
            }}
          />
        </DynamicPopup>

        <ConfirmDiscardDialog
          open={confirmOpen}
          onDiscard={handleDiscard}
          onClose={handleContinueEditing}
          onSave={async () => {
            await form.submit();
            setConfirmOpen(false);
          }}
        />
      </Box>
    </>
  );
};

export default ProductPage;
