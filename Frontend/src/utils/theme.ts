import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette:{
        primary: {
            main: '#ff5722',
            light: '#ff7b54', 
            dark: '#b23c17',  
            contrastText: '#fff', 
        },
        secondary: {
            main: '#2ecc71', 
        },
    }
})

export default theme;