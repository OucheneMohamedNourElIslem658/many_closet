import { BottomNavigation, BottomNavigationAction, styled } from "@mui/material";

const StyledBottomNav = styled(BottomNavigation)(({theme}) => ({
    position: 'sticky',
    left: 0,
    right: 0,
    bottom: 0,
    display: "none",
    [theme.breakpoints.down('md')]: {
        display: 'flex',
    },
}))

const BottomNav = () => {
    return ( 
        <StyledBottomNav showLabels>
            <BottomNavigationAction label="Home"/>
            <BottomNavigationAction label="Shop" />
            <BottomNavigationAction label="New" />
            <BottomNavigationAction label="Reviews" />
            <BottomNavigationAction label="Contact" />
        </StyledBottomNav>
    );
}
 
export default BottomNav;