import { Logout, ShoppingBagOutlined, ShoppingBasketRounded } from "@mui/icons-material";
import { Avatar, Box, Divider, IconButton, ListItem, ListItemAvatar, ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import { Fragment, useState } from "react";
import { logoutUser } from "../../services/auth";
import OrdersDrawer from "../../features/orders/components/order_drawer";
import { Link } from 'react-router-dom';

export default function AccountMenu({currentUser}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [openDrawer, setOpenDrawer] = useState(false)

  return (
    <Fragment>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
        >
            <Avatar sx={{ width: 32, height: 32, backgroundColor: 'black' }}>{currentUser.name[0]}</Avatar>
        </IconButton>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <ListItem>
            <ListItemAvatar>
            <Avatar sx={{ width: 32, height: 32, backgroundColor: 'black' }}>{currentUser.name[0]}</Avatar>
            </ListItemAvatar>
            <ListItemText primary={currentUser.name} secondary={currentUser.email} />
        </ListItem>
        <Divider />
        <MenuItem onClick={() => {
          handleClose();
          setOpenDrawer(true)
        }}>
          <ListItemIcon>
            <ShoppingBagOutlined fontSize="small" />
          </ListItemIcon>
          My Card
        </MenuItem>
        <MenuItem onClick={handleClose} component={Link} to="/orders">
          <ListItemIcon>
            <ShoppingBasketRounded fontSize="small" />
          </ListItemIcon>
          My Orders
        </MenuItem>
        <MenuItem onClick={() => logoutUser()}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
      <OrdersDrawer
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        orderID={null}
        onOrderCreated={(isCreated) => {
          if (isCreated) {
            setOpenDrawer(false)
          }
        }}
      />
    </Fragment>
  );
}