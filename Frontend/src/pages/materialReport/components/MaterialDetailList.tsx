import { useCallback, useEffect, useMemo } from "react";
import {
  Box,
  Button,
  MenuItem,
  Select,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import DataTable, { type ActionConfig } from "@components/DataTable";
import type { MaterialDetailType } from "@/schema/materialDetail.schema";
import useMaterialDetailData from "../customHooks/useMaterialReportDetailData";
import useMaterialDetailForm from "../customHooks/useMaterialReportDetailForm";

interface MaterialDetailListProps {
  material_id: number;
  onSaveSuccess: () => void;
}

const MaterialDetailList = ({
  material_id,
  onSaveSuccess,
}: MaterialDetailListProps) => {
  const {
    fetchDetails,
    detailLoading,
    error,
    rows,
    setRows,
    ingredientOptions,
  } = useMaterialDetailData();

  const refetch = useCallback(
    () => fetchDetails(material_id),
    [fetchDetails, material_id],
  );

  const {
    editingId,
    pendingIds,
    startEditing,
    cancelEditing,
    saveEditing,
    handleAddRow,
    handleFieldChange,
  } = useMaterialDetailForm(
    material_id,
    rows,
    setRows,
    ingredientOptions,
    refetch,
  );

  useEffect(() => {
    fetchDetails(material_id);
  }, [material_id, fetchDetails]);

  const columns = useMemo(
    () => [
      {
        id: "ingredient_name" as keyof MaterialDetailType,
        label: "Nguyên liệu",
        render: (_: unknown, row: MaterialDetailType) => {
          const isPending = pendingIds.has(row.id);
          if (editingId === row.id && isPending) {
            return (
              <Select
                size="small"
                fullWidth
                value={row.ingredient_id || ""}
                onChange={(e) =>
                  handleFieldChange(row.id, "ingredient_id", e.target.value)
                }
                displayEmpty
              >
                <MenuItem value="" disabled>
                  Chọn nguyên liệu
                </MenuItem>
                {ingredientOptions.map((opt) => (
                  <MenuItem key={opt.id} value={opt.id}>
                    {opt.ingredient_name}
                  </MenuItem>
                ))}
              </Select>
            );
          }
          return (
            <Typography variant="body2">
              {row.ingredient_name || "-"}
            </Typography>
          );
        },
      },
      {
        id: "weight" as keyof MaterialDetailType,
        label: "Khối lượng",
        render: (_: unknown, row: MaterialDetailType) => (
          <TextField
            size="small"
            type="number"
            disabled={editingId !== row.id}
            value={row.weight ?? ""}
            onChange={(e) =>
              handleFieldChange(
                row.id,
                "weight",
                e.target.value === "" ? null : Number(e.target.value),
              )
            }
            sx={{
              "& .MuiInputBase-input.Mui-disabled": {
                WebkitTextFillColor: "#000",
              },
            }}
          />
        ),
      },
      {
        id: "real_percent" as keyof MaterialDetailType,
        label: "Tỉ lệ thực",
        render: (_: unknown, row: MaterialDetailType) => (
          <TextField
            size="small"
            type="number"
            disabled={editingId !== row.id}
            value={row.real_percent ?? ""}
            onChange={(e) =>
              handleFieldChange(
                row.id,
                "real_percent",
                e.target.value === "" ? null : Number(e.target.value),
              )
            }
            sx={{
              "& .MuiInputBase-input.Mui-disabled": {
                WebkitTextFillColor: "#000",
              },
            }}
          />
        ),
      },
      {
        id: "note" as keyof MaterialDetailType,
        label: "Ghi chú",
        render: (_: unknown, row: MaterialDetailType) => (
          <TextField
            size="small"
            fullWidth
            disabled={editingId !== row.id}
            value={row.note ?? ""}
            onChange={(e) => handleFieldChange(row.id, "note", e.target.value)}
          />
        ),
      },
      { id: "actions" as const, label: "Thao tác" },
    ],
    [editingId, pendingIds, ingredientOptions, handleFieldChange],
  );

  const getActions = useCallback(
    (row: MaterialDetailType): ActionConfig<MaterialDetailType>[] => {
      if (editingId === row.id)
        return [
          {
            label: "Lưu",
            icon: <DoneOutlinedIcon />,
            color: "success",
            onClick: (r) => saveEditing(r),
          },
          {
            label: "Huỷ",
            icon: <CloseOutlinedIcon />,
            color: "error",
            onClick: () => cancelEditing(),
          },
        ];
      return [
        {
          label: "Sửa",
          icon: <EditOutlinedIcon />,
          color: "primary",
          onClick: (r) => startEditing(r),
        },
      ];
    },
    [editingId, saveEditing, cancelEditing, startEditing],
  );

  if (error)
    return (
      <Typography color="error" textAlign="center">
        {error}
      </Typography>
    );

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
        <Typography variant="h6">Danh sách nguyên liệu</Typography>
        <Button
          variant="contained"
          startIcon={<AddCircleOutlinedIcon />}
          onClick={handleAddRow}
          disabled={!!editingId} // tránh add nhiều row cùng lúc
        >
          Thêm nguyên liệu
        </Button>
      </Box>
      {detailLoading ? (
        <Skeleton variant="rounded" height={300} />
      ) : (
        <DataTable
          columns={columns}
          data={rows}
          actions={getActions}
          getRowKey={(row) => row.id}
          hideEmptyRows
        />
      )}
    </>
  );
};

export default MaterialDetailList;
