import {
  IconButton,
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Tooltip,
  Collapse,
  Box,
  Pagination,
} from "@mui/material";
import React, { useState } from "react";
import type { FieldConfig } from "../types/FieldConfig";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

export interface ActionConfig<T> {
  label: string;
  icon?: React.ReactNode;
  color?: "primary" | "secondary" | "error" | "success" | "warning" | "info";
  onClick: (row: T) => void;
}

interface DynamicTableProps<T> {
  columns: FieldConfig<T>[];
  data: T[];
  actions?: (row: T) => ActionConfig<T>[];
  getRowKey: (row: T) => string | number;
  renderDetail?: (row: T) => React.ReactNode;
  hideEmptyRows?: boolean;
}
const CollapsibleRow = <T,>({
  row,
  columns,
  actions,
  getRowKey,
  renderDetail,
}: {
  row: T;
  columns: FieldConfig<T>[];
  actions?: (row: T) => ActionConfig<T>[];
  getRowKey: (row: T) => string | number;
  renderDetail?: (row: T) => React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <TableRow hover key={getRowKey(row)}>
        {renderDetail && (
          <TableCell sx={{ width: 50 }}>
            <IconButton size="small" onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
        )}
        {columns.map((column) => {
          if (column.id === "actions") {
            const rowActions = actions ? actions(row) : [];
            return (
              <TableCell key="actions" align={column.align || "left"}>
                <Stack direction="row" spacing={1}>
                  {rowActions.map((action, index) => (
                    <Tooltip key={index} title={action.label}>
                      <span>
                        {action.icon ? (
                          <IconButton
                            size="small"
                            color={action.color || "primary"}
                            onClick={() => action.onClick(row)}
                          >
                            {action.icon}
                          </IconButton>
                        ) : (
                          <Button
                            variant="contained"
                            size="small"
                            color={action.color || "primary"}
                            onClick={() => action.onClick(row)}
                          >
                            {action.label}
                          </Button>
                        )}
                      </span>
                    </Tooltip>
                  ))}
                </Stack>
              </TableCell>
            );
          }
          const value = row[column.id as keyof T];
          return (
            <TableCell
              key={column.id.toString()}
              align={column.align || "left"}
              sx={{
                width: column.width,
                whiteSpace: column.noWrap ? "nowrap" : "normal",
                color: column.id.toString() === "id" ? "gray" : "",
                ...(column.id === "actions" && {
                  position: "sticky",
                  right: 0,
                  zIndex: 10,
                  backgroundColor: "#f1f5f9",
                  boxShadow: "-2px 0 5px rgba(0,0,0,0.05)",
                }),
              }}
            >
              {column.render ? column.render(value, row) : String(value ?? "")}
            </TableCell>
          );
        })}
      </TableRow>
      {renderDetail && (
        <TableRow>
          <TableCell
            style={{
              paddingBottom: 0,
              paddingTop: 0,
              borderBottom: open ? "1px solid rgba(224, 224, 224, 1)" : "none",
            }}
            colSpan={columns.length + 1}
          >
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 2 }}>{renderDetail(row)}</Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};
const DataTable = <T,>({
  columns,
  data,
  actions,
  getRowKey,
  renderDetail,
  hideEmptyRows = false,
}: DynamicTableProps<T>) => {
  const [page, setPage] = useState(1);
  const rowsPerPage = 10; //số dòng

  //tổng số trang
  const totalPages = Math.ceil(data.length / rowsPerPage);
  const handleChangePage = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  //Cắt dữ liệu để hiển thị (Logic: (page - 1) * 10)
  const visibleRows = React.useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage;
    return data.slice(startIndex, startIndex + rowsPerPage);
  }, [data, page]);
  const emptyRows = rowsPerPage - visibleRows.length;
  return (
    <Paper sx={{ borderRadius: 1.5, boxShadow: 3, overflow: "hidden" }}>
      <TableContainer
        component={Paper}
        sx={{ borderRadius: 1.5, boxShadow: 0 }}
      >
        <Table size="small">
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              {renderDetail && <TableCell sx={{ width: 50 }} />}
              {columns.map((col) => (
                <TableCell
                  key={col.id.toString()}
                  align={col.align || "left"}
                  style={{ maxWidth: col.width }}
                  sx={{
                    fontWeight: "bold",
                    backgroundColor: "#f1f5f9",
                    width: col.width,
                  }}
                >
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleRows.length > 0 ? (
              visibleRows.map((row) => (
                <CollapsibleRow
                  key={getRowKey(row)}
                  row={row}
                  columns={columns}
                  actions={actions}
                  getRowKey={getRowKey}
                  renderDetail={renderDetail}
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  <Typography variant="body2" sx={{ py: 1 }}>
                    Không có dữ liệu
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {!hideEmptyRows &&
              emptyRows > 0 &&
              Array.from({ length: emptyRows }).map((_, index) => (
                <TableRow key={`empty-${index}`} style={{ height: 47 }}>
                  {" "}
                  <TableCell
                    colSpan={columns.length + (renderDetail ? 1 : 0)}
                  />
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handleChangePage}
            color="primary"
            // shape="rounded"
            showFirstButton
            showLastButton
          />
        </Box>
      )}
    </Paper>
  );
};

export default DataTable;
