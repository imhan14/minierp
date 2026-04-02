import { ConfirmDiscardDialog } from "../../../components/ConfirmDiscardDialog";
import LogExtraInfor from "./LogExtraInfor";
import DataTable, { type ActionConfig } from "../../../components/DataTable";
import { Box, Button, Skeleton, Typography } from "@mui/material";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import type { ProductionLogDetailType } from "../../../types/ProductionLogDetailType";
import { useLogDetailData } from "../customHooks/useLogDetailData";
import { productLogDetailColumns } from "../utils/columns";

interface ProductLogDetailProps {
  log_id: number | null;
  onSaveSuccess: () => void;
}

const ProductionLogDetail = ({
  log_id,
  onSaveSuccess,
}: ProductLogDetailProps) => {
  // const {
  //   showConfirmDialog,
  //   setShowConfirmDialog,
  //   handleDiscardChanges,
  //   handleSaveAndContinue,
  //   guardAction,
  //   cancelEditing,
  //   startEditing,
  //   error,
  //   detailLoading,
  //   editProducts,
  //   setEditProducts,
  //   editingId,
  //   setEditingId,
  //   productOptions,
  //   handleDetailChange,
  //   saveEditing,
  //   handleDeleteRow,
  // } = useProductDetail(log_id, onSaveSuccess);
  const { logDetail } = useLogDetailData(log_id);
  const columns = productLogDetailColumns(
    editingId,
    productOptions,
    handleDetailChange,
  );

  const getDetailActions = (
    row: ProductionLogDetailType,
  ): ActionConfig<ProductionLogDetailType>[] => {
    if (editingId === row.id) {
      return [
        {
          label: "Save",
          icon: <DoneOutlinedIcon />,
          color: "success",
          onClick: (row) => saveEditing(row),
        },
        {
          label: "Cancel",
          icon: <CloseOutlinedIcon />,
          color: "error",
          onClick: () => cancelEditing(),
        },
      ];
    }
    return [
      {
        label: "Edit",
        icon: <EditOutlinedIcon />,
        color: "primary",
        onClick: (row) => startEditing(row),
      },
      {
        label: "Delete",
        icon: <DeleteOutlineIcon />,
        color: "warning",
        onClick: (row) => handleDeleteRow(row),
      },
    ];
  };

  const handleAddNewRow = () => {
    guardAction(() => {
      const newRow: ProductionLogDetailType = {
        product_id: 0,
        isNew: true,
        id: `new-${Date.now()}`,
        product_name: "",
        product_reports: {} as ProductionReportType,
        weight: 0,
        is_finish: false,
        type_of_specification: "",
        start_time: "",
        end_time: "",
        product_line: "",
        specification: "",
        note: "",
      };
      setEditProducts((prev) => [newRow, ...prev]);
      setEditingId(newRow.id);
    });
  };
  if (error) {
    return (
      <Typography color="error" textAlign="center">
        {error}
      </Typography>
    );
  }
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 2,
          alignItems: "center",
        }}
      >
        <Typography variant="h6">Danh sách sản phẩm</Typography>
        <Button
          variant="contained"
          startIcon={<AddCircleOutlinedIcon />}
          onClick={handleAddNewRow}
        >
          Thêm
        </Button>
      </Box>
      {detailLoading ? (
        <Skeleton variant="rounded" height={300} />
      ) : (
        <DataTable
          columns={columns}
          data={editProducts}
          actions={getDetailActions}
          getRowKey={(row) => row.id!}
          renderDetail={(row) => (
            <LogExtraInfor
              row={row}
              isEditing={editingId === row.id}
              onChange={handleDetailChange}
            />
          )}
        />
      )}
      <ConfirmDiscardDialog
        open={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onDiscard={handleDiscardChanges}
        onSave={handleSaveAndContinue}
      />
    </>
  );
};

export default ProductionLogDetail;
