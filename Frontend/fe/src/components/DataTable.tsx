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
        {/* Nút đóng mở ở đầu dòng */}
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
                whiteSpace: column.noWrap ? "nowrap" : "normal",
                maxWidth: column.width,
              }}
            >
              {column.render ? column.render(value, row) : String(value ?? "")}
            </TableCell>
          );
        })}
      </TableRow>

      {/* Phần hiển thị chi tiết 10 trường khi nhấn mở rộng */}
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
}: DynamicTableProps<T>) => {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 1.5, boxShadow: 3 }}>
      <Table>
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
          {data.length > 0 ? (
            data.map((row) => (
              <CollapsibleRow
                key={getRowKey(row)}
                row={row}
                columns={columns}
                actions={actions}
                getRowKey={getRowKey}
                renderDetail={renderDetail}
              />
              // <TableRow key={getRowKey(row)} hover>
              //   {columns.map((column) => {
              //     if (column.id === "actions") {
              //       const rowActions = actions ? actions(row) : [];
              //       return (
              //         <TableCell key="actions" align={column.align || "left"}>
              //           <Stack direction="row" spacing={1}>
              //             {rowActions.map((action, index) => (
              //               <Tooltip key={index} title={action.label}>
              //                 <span>
              //                   {action.icon ? (
              //                     <IconButton
              //                       size="small"
              //                       color={action.color || "primary"}
              //                       onClick={() => action.onClick(row)}
              //                     >
              //                       {action.icon}
              //                     </IconButton>
              //                   ) : (
              //                     <Button
              //                       variant="contained"
              //                       size="small"
              //                       color={action.color || "primary"}
              //                       onClick={() => action.onClick(row)}
              //                     >
              //                       {action.label}
              //                     </Button>
              //                   )}
              //                 </span>
              //               </Tooltip>
              //             ))}
              //           </Stack>
              //         </TableCell>
              //       );
              //     }

              //     const value = row[column.id as keyof T];
              //     return (
              //       <TableCell
              //         key={column.id.toString()}
              //         align={column.align || "left"}
              //         sx={{
              //           whiteSpace: column.noWrap ? "nowrap" : "normal",
              //           overflow: column.noWrap ? "hidden" : "visible",
              //           textOverflow: column.noWrap ? "ellipsis" : "clip",
              //           maxWidth: column.width,
              //         }}
              //         title={String(value)}
              //       >
              //         {column.render
              //           ? column.render(value, row)
              //           : String(value ?? "")}
              //       </TableCell>
              //     );
              //   })}
              // </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} align="center">
                <Typography variant="body2" sx={{ py: 2 }}>
                  Không có dữ liệu
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DataTable;
