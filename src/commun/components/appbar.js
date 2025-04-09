import { styled } from '@mui/material';
import Button from '@mui/material/Button';
import {Link} from 'react-router-dom';

const CustomAppBar = styled('div')(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    maxWidth: 1200,
    margin: '40px auto',
    padding: '0 20px',
    [theme.breakpoints.down('md')]: {
        justifyContent: 'space-between',
    }
}))

const NavigationList = styled('ul')(({theme}) => ({
    display: 'flex',
    listStyleType: 'none',
    gap: 50,
    flexGrow: 1,
    justifyContent: 'end',
    marginRight: 50,
    textDecoration: 'none',
    fontFamily: theme.typography.fontFamily,
    [theme.breakpoints.down('md')]: {
        display: 'none',
    },
}))

const Logo = styled('h1')({
    whiteSpace: 'nowrap'
})

const AppBar = () => {
    return (
        <CustomAppBar>
            <Logo>Many Closet</Logo>
            <NavigationList>
                <Link to="/">Home</Link>
                <Link to="/shop">Shop</Link>
                <Link to="/new">New</Link>
                <Link to="/reviews">Reviews</Link>
                <Link to="/contact">Contact</Link>
            </NavigationList>
            <Button variant="contained" color="primary">
                Sign In
            </Button>
        </CustomAppBar>
    );
}
 
export default AppBar;