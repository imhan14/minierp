import { Box, IconButton, InputAdornment, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import {styled} from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import DataTable, {type ColumnConfig, type ActionConfig} from '../components/DataTable';
import api from '../apis/axios'
import axios from 'axios';


const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface Order{
    code: number, 
    name: string, 
    team: string,
    shift: string,
    quantity: number,
    color: string, 
    specifications: string, 
    start: string,
    end: string,
    details: string
}

const OrderPage = () => {
    // const orders:Order[]  = [
    //     { code: 13234, name: 'Sản phẩm A', team: '100.000đ', shift: '1C2x12', quantity: 5044545645, color: 'red', specifications:'50', start: '2026-01-16 06:00', end: '8:00', details: 'icon' },
    //     { code: 2234, name: 'Sản phẩm AAAAAAAAAMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM', team: '100.000đ', shift: '1', quantity: 50, color: 'red', specifications:'50', start: '7:00', end: '8:00', details: 'icon' },
    //     { code: 3, name: 'Sản phẩm A', team: 'Tổ Trộn', shift: '1C2x12', quantity: 50, color: 'redddddddddddd', specifications:'50', start: '2026-01-16 06:00', end: '8:00', details: 'icon' },
    //     { code: 4, name: 'Sản phẩm A', team: 'Cơ điện', shift: 'C2x12', quantity: 50546, color: 'red', specifications:'50', start: '2026-01-16 06:00', end: '2026-01-16 06:00', details: 'icon' },
    //     { code: 5, name: 'Sản phẩm A', team: '100.000đ', shift: 'C2x12', quantity: 50, color: 'red', specifications:'50', start: '2026-01-16 06:00', end: '2026-01-16 06:00', details: 'icon' },
    //     { code: 6, name: 'Sản phẩm A', team: '100.0000000000đ', shift: '1C2x12', quantity: 50, color: 'red', specifications:'50000000', start: '2026-01-16 06:00', end: '8:00', details: 'icon' },
    //     { code: 7, name: 'Sản phẩm A', team: '100.000đ', shift: '1', quantity: 505565, color: 'red', specifications:'50', start: '2026-01-16 06:00', end: '2026-01-16 06:00', details: 'icon' },
    //     { code: 8, name: 'Sản phẩm A', team: '100.000đ', shift: '1', quantity: 50, color: 'red', specifications:'50', start: '2026-01-16 06:00', end: '2026-01-16 06:00', details: 'icon' },
    //     { code: 9, name: 'Sản phẩm A', team: '100.000đ', shift: '1', quantity: 50, color: 'red', specifications:'50', start: '2026-01-16 06:00', end: '2026-01-16 06:00', details: 'icon' },
    //     { code: 10, name: 'Sản phẩm A', team: '100.000đ', shift: '1', quantity: 50, color: 'red', specifications:'50', start: '7:00', end: '8:2026-01-16 06:00', details: 'icon' },
    // ];

    const orderColumns: ColumnConfig<Order>[] = [
        { id: 'code',           label: 'Code',              width: 100 },
        { id: 'name',           label: 'Name',              width:200, noWrap:true },
        { id: 'team',           label: 'Team'               },        
        { id: 'shift',          label: 'Shift',             align: 'right' },
        { id: 'quantity',       label: 'Quantity',          align: 'right' },
        { id: 'color',          label: 'Color',             align: 'right' },
        { id: 'specifications', label: 'Specifications',    align: 'right' },
        { id: 'start',          label: 'Start',             width:200, align: 'right' },
        { id: 'end',            label: 'End',               align: 'right' },
        { id: 'actions',        label: 'Details',          align: 'right' },
    ];
    const actions: ActionConfig<Order>[] = [
        {
        label: 'Sửa',
        color: 'primary',
        onClick: (row) => console.log('Edit user:', row.code),
        },
        {
        label: 'Xóa',
        color: 'error',
        onClick: (row) => alert('Xóa user: ' + row.name),
        },
    ];
    const [value, setValue] = React.useState<Dayjs | null>(dayjs());
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchOrders = async () => {
    try {
      setLoading(true);
      // Thay URL này bằng API thật của bạn
      const response = await axios.get<Order[]>('/product-order');
      
      setOrders(response.data);
      setError(null);
    } catch (err) {
      setError('Không thể tải dữ liệu đơn hàng. Vui lòng thử lại!');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };
    const onDayChange = async () =>{
        try{
            const response = await api.get('/product-order');
            console.log(response.data)
        }catch(err){
            if (axios.isAxiosError(err)) {
        const msg = err.response?.data?.error || "Lỗi server";
        // setServerError(msg);
      } else {
        console.log("Err");
        console.error(err)
        // setServerError("Đã có lỗi không xác định xảy ra");
      }
        }
    }

    useEffect(() => {
        fetchOrders();
    }, []);
if (loading) {
    return (
        <Box  >
            <DrawerHeader />
            <Box 
                sx={{
                    display: 'flex', 
                    alignItems: 'center', 
                    borderRadius: 1.5, 
                    gap: 4, 
                    backgroundColor: 'white', 
                    p: 4,
                    mb:4,
                    width: '100%', 
                    boxShadow: '0px 2px 10px rgba(0,0,0,0.05)',
                    position: 'sticky',
                    top: 64
                }}>
                {/* <TextField/> */}
                <Typography sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                    Filters: 
                </Typography>
                <DatePicker
                    label="Pick date"
                    value={value}
                    onChange={(newValue) => setValue(newValue)}
                    format='DD/MM/YYYY'
                    slotProps={{
                        textField: {
                            sx:{ maxWidth: '200px'},
                            size: 'small',
                            fullWidth: true,
                        },
                    }}
                    onAccept={onDayChange}
                />
                <TextField
                    variant="outlined"
                    placeholder="Search..."
                    size="small" 
                    fullWidth   
                    sx={{
                        maxWidth: '400px',
                        borderRadius: 1.5,
                        '& .MuiOutlinedInput-root': {
                        color: 'black', 
                        '& fieldset': {
                            borderColor: 'gray 0.5',
                        },
                        '&:hover fieldset': {
                            borderColor: 'black',
                        },
                        },
                    }}

                    InputProps={{
                        startAdornment: (
                        <InputAdornment position="start">
                            <IconButton>
                                <SearchIcon sx={{ color: 'gray' }} />
                            </IconButton>
                        </InputAdornment>
                        ),
                    }}
                />
            </Box>
            <DataTable columns={orderColumns} data={""} actions={actions} getRowKey={(row) => row.code} />
        </Box>
    )}
}

export default OrderPage