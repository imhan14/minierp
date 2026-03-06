import { Box, CircularProgress, IconButton, InputAdornment, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import {styled} from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import DataTable, {type ColumnConfig, type ActionConfig} from '../components/DataTable';
import api from '../apis/axios'
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface Team {
  team_name: string;
}
interface OrderData{
    id: number,
    order_date: string,
    formula_id: number,
    teams: Team,
    product_shift: string,
    target_quantity:number,
    urea_rate?: number | null,
    status: string,
    input_temprature_1 :number,
    output_temprature_1:number,
    input_temprature_2 :number,
    output_temprature_2:number,
    order_note         :string,
    created_at         :string,
    created_by         :number
}   
interface OrderDisplay extends Omit<OrderData, 'teams'> {
  team_name: string;
}

interface Status{
    ok: string,
    pending: string,
    cancel: string
}
const textStatus:Status = {
    'ok': '#e8f5e9',
    'pending': '#ffd7b5',
    'cancel':'#ffebee'
}
const bgStatus:Status = {
    'ok': '#2e7d32',
    'pending': '#ff6700',
    'cancel':'#d32f2f'
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

    const orderColumns: ColumnConfig<OrderData>[] = [
        { id: 'id',           label: 'Id',              width: 100 },
        { id: 'order_date',           label: 'Date',              width:200, noWrap:true, render:(value: string) => {
            if (!value) return '-';
            return dayjs(value).add(24, 'hour').format('DD/MM/YYYY');
            } },
        { id: 'formula_id',           label: 'Formular'               },        
        { id: 'team_name',          label: 'Team Name',width:200,             align: 'right' },
        { id: 'product_shift',       label: 'Shift',          align: 'right' },
        { id: 'target_quantity',          label: 'Quantity',             align: 'right' },
        { id: 'urea_rate', label: 'Urea',    align: 'right' },
        { id: 'status',          label: 'Status',             width:200, align: 'right', noWrap:true, render: (value: string) => (
                <span style={{ 
                    backgroundColor: textStatus[value as keyof Status], 
                    color: bgStatus[value as keyof Status],
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    textTransform: 'uppercase'
                }}>
                {value === 'ok' ? 'Hoàn tất' : value === 'pending' ? 'đang đợi': 'Đã hủy'}
                </span>
            ) },
        { id: 'input_temprature_1',            label: 'In Temp 1',               align: 'right' },
        { id: 'output_temprature_1',            label: 'Out Temp 1',               align: 'right' },
        { id: 'input_temprature_2',            label: 'In Temp 2',               align: 'right' },
        { id: 'output_temprature_2',            label: 'Out Temp 2',               align: 'right' },
        // { id: 'order_note',            label: 'Note',               align: 'right', width:200, noWrap:true },
        { id: 'actions',        label: 'Details',          align: 'right' },
    ];
    const actions: ActionConfig<OrderData>[] = [
        {
            label: 'Details',
            color: 'primary',
            icon: <RemoveRedEyeOutlinedIcon/>,
            onClick: (row) => console.log('Detail of:', row.id),
        },
    ];
    // const actions: ActionConfig<OrderData>[] = [
    //     {
    //         label: 'Sửa',
    //         color: 'primary',
    //         onClick: (row) => console.log('Edit user:', row.id),
    //     },
    //     {
    //         label: 'Xóa',
    //         color: 'error',
    //         onClick: (row) => alert('Xóa user: ' + row.id),
    //     },
    // ];
    // const [value, setValue] = React.useState<Dayjs | null>(dayjs());
    const [orders, setOrders] = useState<OrderDisplay[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());

    const fetchOrders = async (date?: Dayjs | null) => {
        try {
            setLoading(true);
            const dateParam = date ? date.format('YYYY-MM-DD') : '';
            const response = await api.get<OrderData[]>(`/product-order?date=${dateParam}`);
            const formattedData: OrderDisplay[] = response.data.map(item => ({
                ...item,
                team_name: item.teams?.team_name || 'N/A'
            }));
            // console.log(formattedData);
            setOrders(formattedData);
            setError(null);
        } catch (err) {
            setError('Không thể tải dữ liệu đơn hàng. Vui lòng thử lại!');
            console.error('API Error:', err);
        } finally {
        setLoading(false);
        }
    };
    // const onDayChange = async () =>{
    //     try{
    //         const response = await api.get<OrderData[]>('/product-order');
    //         const formattedData: OrderDisplay[] = response.data.map(item => ({
    //             ...item,
    //             team_name: item.teams?.team_name || 'N/A'
    //         }));
    //         setOrders(formattedData);

    //     }catch(err){
    //         if (axios.isAxiosError(err)) {
    //         setError('Không thể tải dữ liệu đơn hàng. Vui lòng thử lại!');
    //         console.error('API Error:', err);
    //         } else {
    //             console.log("Err");
    //             console.error(err)
    //             // setServerError("Đã có lỗi không xác định xảy ra");
    //         }
    //     }
    // }

    useEffect(() => {
        fetchOrders(selectedDate);
    }, [selectedDate]);
    if (loading) {
        return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
            <CircularProgress />
        </Box>
        );
    }
    if (error) {
        return <Typography color="error" textAlign="center">{error}</Typography>;
    }

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
                    value={selectedDate}
                    onChange={(newValue) => setSelectedDate(newValue)}
                    format='DD/MM/YYYY'
                    slotProps={{
                        textField: {
                            sx:{ maxWidth: '200px'},
                            size: 'small',
                            fullWidth: true,
                        },
                    }}
                    // onAccept={onDayChange}
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
            <DataTable columns={orderColumns} data={orders} actions={actions} getRowKey={(row) => row.id} />
        </Box>
    )
}

export default OrderPage