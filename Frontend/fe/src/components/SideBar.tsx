import * as React from 'react';
import type {  Theme, CSSObject } from '@mui/material/styles';
import {styled} from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
// import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Box, Typography } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import InventoryIcon from '@mui/icons-material/Inventory';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import GradingIcon from '@mui/icons-material/Grading';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
// import SettingsIcon from '@mui/icons-material/Settings';
import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router';

const drawerWidth = 240;
const backgroundColor = '#22C55E';
const textColor = 'white';

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
  backgroundColor: backgroundColor,
  color: textColor,
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
  backgroundColor: backgroundColor,
  color:textColor,
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    display: 'flex',
    variants: [
      {
        props: ({ open }) => open,
        style: {
          ...openedMixin(theme),
          '& .MuiDrawer-paper': openedMixin(theme),
        },
      },
      {
        props: ({ open }) => !open,
        style: {
          ...closedMixin(theme),
          '& .MuiDrawer-paper': closedMixin(theme),
        },
      },
    ],
  }),
);

interface SideBarProps{
  open: boolean,
  onOpen: () => void,
  onTitleChange: (title: string) => void,
}

const menuItems = [
  {text: 'Order', icon: <AssignmentIcon/>, path:'/'},
  {text: 'Material Report', icon: <InventoryIcon/>, path:'/material-report'},
  {text: 'Product Report', icon: <AssignmentTurnedInIcon/>, path: '/production-report'},
  {text: 'Production Log', icon: <GradingIcon/>, path: '/production-log'}
]
const SideBar = ({open, onOpen, onTitleChange}:SideBarProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { full_name, role } = useSelector((state: RootState) => state.auth);

  const handleLogout = () =>{
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // localStorage.clear();
    dispatch(logout());
    navigate('/login');
  }
  return (
      <Drawer variant="permanent" open={open}>
        <Box sx={{flex:1}}>
          <DrawerHeader sx={{display:'flex', justifyContent:'space-around'}}>
          {open && <Typography variant='h5' noWrap >TITLE NAME</Typography>}
          <IconButton onClick={onOpen} 
            >
            {/* {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />} */}
              {
                open ? <ChevronLeftIcon/> : <ChevronRightIcon />
              }
          </IconButton>
          </DrawerHeader>
          <Divider />
          <List>
            <ListItem disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                sx={[
                  {
                    minHeight: 48,
                    px: 2.5,
                  },
                  open
                    ? {
                        justifyContent: 'initial',
                      }
                    : {
                        justifyContent: 'center',
                      },
                ]}
              >
                <ListItemIcon
                  sx={[
                    {
                      minWidth: 0,
                      justifyContent: 'center',
                      color: 'white',
                      py:1.5
                    },
                    open
                      ? {
                          mr: 3,
                        }
                      : {
                          mr: 'auto',
                        },
                  ]}
                >
                  <PersonIcon/>
                </ListItemIcon>
                {
                  open && 
                  <Box>
                    <Typography>{full_name}</Typography>
                    <Typography>{role}</Typography>
                  </Box>
                }
              </ListItemButton>
            </ListItem>
          </List>
          <Divider />
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
                <ListItemButton
                  onClick={() => {onTitleChange(item.text);navigate(item.path);}}
                  sx={[
                    {
                      minHeight: 48,
                      px: 2.5,
                    },
                    open
                      ? {
                          justifyContent: 'initial',
                        }
                      : {
                          justifyContent: 'center',
                        },
                  ]}
                >
                  <ListItemIcon
                    sx={[
                      { minWidth: 0, justifyContent: 'center', color: 'white' },
                      open ? { mr: 3, } : { mr: 'auto', },
                    ]}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    sx={[ open ? { opacity: 1, } : { opacity: 0, }, ]}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
        <Divider />
          <List>
            <ListItem disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                onClick={handleLogout}
                sx={[
                  {
                    minHeight: 48,
                    px: 2.5,
                  },
                  open
                    ? {
                        justifyContent: 'initial',
                      }
                    : {
                        justifyContent: 'center',
                      },
                ]}
              >
                <ListItemIcon
                  sx={[
                    {
                      minWidth: 0,
                      justifyContent: 'center',
                      color: 'white',
                    },
                    open ? { mr: 3, } : { mr: 'auto', },
                  ]}
                >
                  <LogoutIcon/>
                </ListItemIcon>
                <ListItemText
                    primary={"Logout"}
                    sx={[{color: 'white',},open ? { opacity: 1, } : { opacity: 0, }, ]}
                  />
              </ListItemButton>
            </ListItem>
          </List>
      </Drawer>
  )
}

export default SideBar