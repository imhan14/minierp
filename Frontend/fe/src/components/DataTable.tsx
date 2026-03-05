import { Button, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import React from 'react'

export interface ColumnConfig<T> {
  id: keyof T | 'actions'; 
  label: string;
  align?: 'left' | 'right' | 'center';
  width?: number | string;
  noWrap?: boolean;
}

export interface ActionConfig<T> {
  label: string;
  color?: 'primary' | 'secondary' | 'error' | 'success' | 'warning' | 'info';
  onClick: (row: T) => void;
}

interface DynamicTableProps<T> {
  columns: ColumnConfig<T>[];
  data: T[];
  actions?: ActionConfig<T>[];
  getRowKey: (row: T) => string | number;
}

const DataTable = <T,>({ columns, data, actions, getRowKey }: DynamicTableProps<T>) => {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 1.5, boxShadow: 3 }}>
        <Table>
        <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
            {columns.map((col) => (
              <TableCell 
                key={col.id.toString()} 
                align={col.align || 'left'} 
                style={{maxWidth: col.width}}
                sx={{ fontWeight: 'bold', backgroundColor: '#f1f5f9', width: col.width }}
              >
                {col.label}
              </TableCell>
            ))}
            </TableRow>
        </TableHead>
        <TableBody>
            {data.length > 0 ? 
            data.map((row) => (
            <TableRow key={getRowKey(row)} hover>
              {columns.map((column) => {
                if (column.id === 'actions') {
                    return (
                      <TableCell key="actions" align={column.align || 'left'}>
                        <Stack direction="row" spacing={1}>
                          {actions?.slice(0, 2).map((action, index) => (
                            <Button
                              key={index}
                              variant="contained"
                              size="small"
                              color={action.color || 'primary'}
                              onClick={() => action.onClick(row)}
                            >
                              {action.label}
                            </Button>
                          ))}
                        </Stack>
                      </TableCell>
                    );
                }
                const value = row[column.id as keyof T];
                return (
                    <TableCell
                      key={column.id.toString()}
                      align={column.align || 'left'}
                      sx={{
                        whiteSpace: column.noWrap ? 'nowrap' : 'normal',
                        overflow: column.noWrap ? 'hidden' : 'visible',
                        textOverflow: column.noWrap ? 'ellipsis' : 'clip',
                        maxWidth:column.width
                      }}
                    >
                      {String(value)}
                    </TableCell>
                );
              })}
            </TableRow>
          )): (
            <TableRow>
              <TableCell colSpan={columns.length} align="center">
                <Typography variant="body2" sx={{ py: 2 }}>Không có dữ liệu</Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        </Table>
    </TableContainer>
  )
}

export default DataTable