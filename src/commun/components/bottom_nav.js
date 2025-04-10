import { BottomNavigation, BottomNavigationAction, styled } from "@mui/material";
import {HomeRounded, ShopRounded, NewReleasesRounded, ReviewsRounded, ContactMailRounded} from '@mui/icons-material';
import { Link } from "react-router-dom";

const StyledBottomNav = styled(BottomNavigation)(({theme}) => ({
    position: 'sticky',
    maxWidth: '95%',
    display: "none",
    borderRadius: 10,
    margin: '0 auto',
    boxShadow: 'hsla(220, 30%, 5%, 0.07) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.07) 0px 8px 16px -5px;',
    border: 'hsla(220, 20%, 80%, 0.4) 1px solid',
    [theme.breakpoints.down('md')]: {
        display: 'flex',
        bottom: 10,
    },
}))

const BottomNav = () => {
    return ( 
        <StyledBottomNav showLabels>
            <BottomNavigationAction label="Home" icon={<HomeRounded />} component={Link} to="/" />
            <BottomNavigationAction label="Shop" icon={<ShopRounded />} component={Link} to="/shop" />
            <BottomNavigationAction label="New" icon={<NewReleasesRounded/>} component={Link} to="/new" />
            <BottomNavigationAction label="Reviews" icon={<ReviewsRounded/>} component={Link} to="/reviews"/>
            <BottomNavigationAction label="Contact" icon={<ContactMailRounded />} component={Link} to="/contact"/>
        </StyledBottomNav>
    );
}
 
export default BottomNav;