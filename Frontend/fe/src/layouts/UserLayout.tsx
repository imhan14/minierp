import React, { useState } from 'react'
import { Outlet } from 'react-router'
import SideBar from '../components/SideBar'
import { Box, CssBaseline } from '@mui/material'
import PageHeader from '../components/PageHeader'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const drawerWidth = 240;
const closedWidth = 64;

const UserLayout = () => {
  const [open, setOpen] = useState(true);
  const [title, setTitle] = useState("Order");

  const handleToggleSideBar =() =>{
    setOpen(!open);
  }
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ display: 'flex', backgroundColor:'#cbffde', overflowX: 'hidden', height: '100vh', width: '100%', overflow: 'hidden'}}>
        <CssBaseline />
        <PageHeader title={title} open={open} drawerWidth={drawerWidth} closedWidth={closedWidth} />
        <SideBar open={open} onOpen={handleToggleSideBar} onTitleChange={setTitle} />
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1, 
            height: '100vh',
            display: 'flex', 
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >

          <Box sx={{ 
            flexGrow: 1, 
            overflowY: 'auto',
            p: 3 
          }}>
            <Outlet context={[setTitle]}/>
          </Box>
        </Box>
      </Box>
    </LocalizationProvider>
  )
}

export default UserLayout