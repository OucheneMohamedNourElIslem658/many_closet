import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { CircularProgress, MenuItem, Select } from '@mui/material';
import { PromiseBuilder } from '../../../commun/components/promise_builder';
import { getOrderFormData, makeOrder } from '../../../services/order';
import { KeyboardArrowDownRounded } from '@mui/icons-material';
import CustomizedSnackbar from '../../../commun/components/snackbar';

export default function OrderForm({orderID, onOrderCreated}) {
  const [open, setOpen] = React.useState(false);
  const [disabled, setDisabled] = React.useState(true);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  async function createOrder({ address, price_id, cardID, name, phone }) {
    try {
      setDisabled(true);
      await makeOrder({
        address: address,
        price_id: price_id,
        cardID: cardID,
        name: name,
        phone: phone,
      });
      setDisabled(false);
      setOpen(false);
      onOrderCreated(true);
    } catch (error) {
      setDisabled(false);
      setOpen(false);
      setSnackbarMessage(error.message);
      setOpenSnackbar(true);
    }
  }

  return (
    <React.Fragment>
      <Button variant="contained" onClick={handleClickOpen}>
        Make The Order
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            component: 'form',
            onSubmit: async (event) => {
              
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              const formJson = Object.fromEntries(formData.entries());

              const address = formJson.address;
              const price_id = formJson.delivery_price;
              const name = formJson.name;
              const phone = formJson.phone;
              const cardID = orderID;
              await createOrder({ address, price_id, cardID, name, phone });
            },
          },
        }}
      >
        <DialogTitle fontFamily={'Volkhov'} fontSize={'30px'}>Order</DialogTitle>
        <PromiseBuilder
          promise={getOrderFormData}
          loading={
            <DialogContent>
              <CircularProgress style={{margin: '50px 100px'}}/>
            </DialogContent>
          }
          builder={(data) => {
            setDisabled(false);
            const prices = data.deliveryPrices;
            

            const currentUserName = data.user.name || '';

            return (
              <DialogContent>
                <DialogContentText>
                  Fill in the form below to make an order.
                </DialogContentText>
                  <TextField
                    margin="dense"
                    id="name"
                    name="name"
                    label="Name"
                    type="text"
                    fullWidth
                    variant="standard"
                    required
                    defaultValue={currentUserName}
                    disabled={disabled}
                  />
                  <TextField
                    margin="dense"
                    id="phone"
                    name="phone"
                    label="Phone Number"
                    type="tel"
                    fullWidth
                    variant="standard"
                    required
                    disabled={disabled}
                    style={{
                      marginBottom: '20px',
                    }}
                  />
                  <Select
                    value={prices[0].id}
                    labelId="delivery-price-label"
                    id="delivery-price"
                    name="delivery_price"
                    label="Delivery Price"
                    fullWidth
                    variant="standard"
                    required
                    disabled={disabled}
                    IconComponent={() => <KeyboardArrowDownRounded/>}
                  >
                    {prices.map((price) => (
                      <MenuItem key={price.id} value={price.id}>
                        {price.state} - {price.price} AMD
                      </MenuItem>
                    ))}
                  </Select>
                  <TextField
                    margin="dense"
                    id="address"
                    name="address"
                    label="Address"
                    type="text"
                    fullWidth
                    variant="standard"
                    disabled={disabled}
                    required
                  />
              </DialogContent>
            );
          }}
        />
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type='submit' disabled={disabled}>Make Order</Button>
        </DialogActions>
      </Dialog>
      <CustomizedSnackbar
        open={openSnackbar}
        message={snackbarMessage}
        type="error"
      />
    </React.Fragment>
  );
}