import { Box, IconButton, InputAdornment, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'
import React from 'react'
import {styled} from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const products = [
  { id: 1, name: 'Sản phẩm A', price: '100.000đ', stock: 50 },
  { id: 2, name: 'Sản phẩm B', price: '200.000đ', stock: 12 },
];

const OrderPage = () => {
    const [value, setValue] = React.useState<Dayjs | null>(dayjs());
    return (
        <Box component="main" sx={{ flexGrow: 1, p: 3 }} >
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
                    boxShadow: '0px 2px 10px rgba(0,0,0,0.05)'
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
            <Box 
                sx={{
                    display: 'flex', 
                    alignItems: 'center', 
                    borderRadius: 1.5, 
                    gap: 4, 
                    backgroundColor: 'white', 
                    p: 4,
                    width: '100%', 
                    boxShadow: '0px 2px 10px rgba(0,0,0,0.05)',
                    
                }}
            >
                <TableContainer component={Paper} sx={{ borderRadius: 1.5, boxShadow: 3 }}>
                    <Table>
                    <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Tên sản phẩm</TableCell>
                        <TableCell align="right">Giá</TableCell>
                        <TableCell align="right">Kho hàng</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map((row) => (
                        <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell>{row.id}</TableCell>
                            <TableCell>{row.name}</TableCell>
                            <TableCell align="right">{row.price}</TableCell>
                            <TableCell align="right">{row.stock}</TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                </TableContainer>


            </Box>
        </Box>
    )
}

export default OrderPage