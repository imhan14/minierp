import { Box, Typography } from '@mui/material'
import React, { useState } from 'react'
import {styled} from '@mui/material/styles';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import Filters from '../components/Filters';

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const ProductionLogPage = () => {
   const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
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
  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Filters selectedDate={selectedDate} setSelectedDate={setSelectedDate}/>
        <Typography sx={{ marginBottom: 2 }}>
            PRODUCTION LOG
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
          tempor incididunt ut labore et dolore magna aliqua. Rhoncus dolor purus non
          enim praesent elementum facilisis leo vel. Risus at ultrices mi tempus
          imperdiet. Semper risus in hendrerit gravida rutrum quisque non tellus.
          Convallis convallis tellus id interdum velit laoreet id donec ultrices.
          Odio morbi quis commodo odio aenean sed adipiscing. Amet nisl suscipit
          adipiscing bibendum est ultricies integer quis. Cursus euismod quis viverra
          nibh cras. Metus vulputate eu scelerisque felis imperdiet proin fermentum
          leo. Mauris commodo quis imperdiet massa tincidunt. Cras tincidunt lobortis
          feugiat vivamus at augue. At augue eget arcu dictum varius duis at
          consectetur lorem. Velit sed ullamcorper morbi tincidunt. Lorem donec massa
          sapien faucibus et molestie ac.
        </Typography>
        <Typography sx={{ marginBottom: 2 }}>
          Consequat mauris nunc congue nisi vitae suscipit. Fringilla est ullamcorper
          eget nulla facilisi etiam dignissim diam. Pulvinar elementum integer enim
          neque volutpat ac tincidunt. Ornare suspendisse sed nisi lacus sed viverra
          tellus. Purus sit amet volutpat consequat mauris. Elementum eu facilisis
          sed odio morbi. Euismod lacinia at quis risus sed vulputate odio. Morbi
          tincidunt ornare massa eget egestas purus viverra accumsan in. In hendrerit
          gravida rutrum quisque non tellus orci ac. Pellentesque nec nam aliquam sem
          et tortor. Habitant morbi tristique senectus et. Adipiscing elit duis
          tristique sollicitudin nibh sit. Ornare aenean euismod elementum nisi quis
          eleifend. Commodo viverra maecenas accumsan lacus vel facilisis. Nulla
          posuere sollicitudin aliquam ultrices sagittis orci a.
        </Typography>
      </Box>
  )
}

export default ProductionLogPage