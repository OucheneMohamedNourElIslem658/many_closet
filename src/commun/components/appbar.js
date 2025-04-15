import { Avatar, Box, Button, IconButton, Popper, styled } from '@mui/material';
import { Link } from 'react-router-dom';
import SignInDialog from '../../features/landing/components/sign_in_dialog';
import { createCurrentUser, getUser, logoutUser } from '../../services/auth';
import { useEffect, useState } from 'react';
import { AccountCircle, LogoutRounded } from '@mui/icons-material';
import AccountMenu from './account_menu';

const CustomAppBar = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    maxWidth: 1200,
    margin: '40px auto',
    padding: '0 20px',
    [theme.breakpoints.down('md')]: {
        justifyContent: 'space-between',
    }
}));

const NavigationList = styled('ul')(({ theme }) => ({
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
}));

const Logo = styled('h1')({
    whiteSpace: 'nowrap',
});

const StyledLink = styled(Link)(({ theme }) => ({
    position: 'relative',
    color: theme.palette.text.primary,
    textDecoration: 'none',
    paddingBottom: '4px',
    '&::after': {
        content: '""',
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '0%',
        height: '0.7px',
        backgroundColor: theme.palette.primary.main,
        transition: 'width 0.3s ease-in-out',
    },
    '&:hover::after': {
        width: '100%',
    },
}));

const AppBar = () => {

    const [currentUser, setUser] = useState(null);

    useEffect(() => {
        const getCurrentUser = async () => {
            const userData = await getUser();
            setUser(userData)
        };

        getCurrentUser();
    }, []);

    return (
        <CustomAppBar>
            <Logo>Many Closet</Logo>
            <NavigationList>
                <li>
                    <StyledLink to="/">Home</StyledLink>
                </li>
                <li>
                    <StyledLink to="/shop">Shop</StyledLink>
                </li>
                <li>
                    <StyledLink to="/new">New</StyledLink>
                </li>
                <li>
                    <StyledLink to="/reviews">Reviews</StyledLink>
                </li>
                <li>
                    <StyledLink to="/contact">Contact</StyledLink>
                </li>
            </NavigationList>
            {
                currentUser ? (
                    <AccountMenu currentUser={currentUser}/>
                ) : (
                    <SignInDialog />
                )
            }
        </CustomAppBar>
    );
}

export default AppBar;
