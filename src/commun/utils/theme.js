import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#000000',
        },
        secondary: {
            main: '#8A8A8A',
        },
        error: {
            main: '#FF4646',
        },
    },
    typography: {
        fontFamily: 'Poppins, sans-serif',
        
    },
    components: {
        MuiButton: {
            styleOverrides: {
                contained: {
                    padding: '13px 25px',
                    borderRadius: '12px',
                },
            },
        },
    },
})

export default theme