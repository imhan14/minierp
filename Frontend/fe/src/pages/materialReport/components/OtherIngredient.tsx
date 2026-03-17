import { Box, Button, Typography } from "@mui/material";
import React, { useState } from "react";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import type { MaterialDetailDisplay } from "../../../schema/materialDetail.schema";
const OtherIngredient = () => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editIngredients, setEditIngredients] = useState<
    MaterialDetailDisplay[]
  >([]);
  const handleAddNewRow = () => {
    const newRow: MaterialDetailDisplay = {
      id: Date.now(),
      ingredient_name: "",
      weight: 0,
      real_percent: 0,
      note: "Nguyên liệu thêm mới",
      isNew: true, // Flag để BE biết đây là dòng cần INSERT chứ không phải UPDATE
    };
    setEditIngredients((prev) => [newRow, ...prev]);
    setEditingId(newRow.id);
  };
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
          onClick={handleAddNewRow}
        >
          Thêm nguyên liệu ngoài danh mục
        </Button>
      </Box>
      {detailLoading ? (
        <Skeleton variant="rounded" height={300} />
      ) : (
        <DataTable
          columns={materialDetailColumns}
          data={editIngredients}
          actions={getDetailActions}
          getRowKey={(row) => row.id}
        />
      )}
    </>
  );
};

export default OtherIngredient;
