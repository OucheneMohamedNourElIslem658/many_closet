import { styled } from '@mui/material';
import Button from '@mui/material/Button';
import {Link} from 'react-router-dom';

const CustomAppBar = styled('div')({
    display: 'flex',
    alignItems: 'center',
    maxWidth: 1200,
    margin: '40px auto',
})

const NavigationList = styled('ul')(({theme}) => ({
    display: 'flex',
    listStyleType: 'none',
    gap: 50,
    flexGrow: 1,
    justifyContent: 'end',
    marginRight: 50,
    textDecoration: 'none',
    fontFamily: theme.typography.fontFamily,
}))

const AppBar = () => {
    return (
        <CustomAppBar>
            <h1>Many Closet</h1>
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