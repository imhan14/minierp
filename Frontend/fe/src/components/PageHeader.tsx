import React from 'react'
// import MenuIcon from '@mui/icons-material/Menu';
import Typography from '@mui/material/Typography';
// import MuiAppBar from '@mui/material/AppBar';
// import type { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
// import {styled} from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
// import { Box } from '@mui/material';
// import IconButton from '@mui/material/IconButton';

// const drawerWidth = 240;

// interface AppBarProps extends MuiAppBarProps {
//   open?: boolean;
// }

// const AppBar = styled(MuiAppBar, {
//   shouldForwardProp: (prop) => prop !== 'open',
// })<AppBarProps>(({ theme }) => ({
//   zIndex: theme.zIndex.drawer + 1,
//   transition: theme.transitions.create(['width', 'margin'], {
//     easing: theme.transitions.easing.sharp,
//     duration: theme.transitions.duration.leavingScreen,
//   }),
//   variants: [
//     {
//       props: ({ open }) => open,
//       style: {
//         marginLeft: drawerWidth,
//         width: `calc(100% - ${drawerWidth}px)`,
//         transition: theme.transitions.create(['width', 'margin'], {
//           easing: theme.transitions.easing.sharp,
//           duration: theme.transitions.duration.enteringScreen,
//         }),
//       },
//     },
//   ],
// }));

interface HeaderProps {
    title?: string
}


const PageHeader = ({title}:HeaderProps) => {
//     const [open, setOpen] = React.useState(false);
//     const handleDrawerOpen = () => {
//     setOpen(true);
//   };
  return (
        <AppBar 
            // position="fixed"
            // sx={{ width: '85%' }}
        >
        <Toolbar>
          {/* <IconButton
            color="inherit"
            aria-label="open drawer"
            // onClick={onOpen}
            edge="start"
            sx={[
              {
                marginRight: 5,
              },
              open && { display: 'none' },
            ]}
          >
            <MenuIcon />
          </IconButton> */}
          <Typography variant="h6" noWrap component="div">
            Mini variant drawer {title}
          </Typography>
        </Toolbar>
      </AppBar>

  )
}

export default PageHeader