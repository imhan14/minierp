import * as React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
// import PageHeader from '../components/PageHeader';
// import {styled} from '@mui/material/styles';
// import SideBar from '../components/SideBar';
// import { Typography } from '@mui/material';
import OrderPage from './OrderPage';

// const DrawerHeader = styled('div')(({ theme }) => ({
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'flex-end',
//   padding: theme.spacing(0, 1),
//   // necessary for content to be below app bar
//   ...theme.mixins.toolbar,
// }));

const Home = () => {
  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <CssBaseline />
      <OrderPage/>
    </Box>
  )
}

export default Home