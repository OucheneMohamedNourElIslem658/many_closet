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
import { KeyboardArrowDownRounded, PieChart } from '@mui/icons-material';
import CustomizedSnackbar from '../../../commun/components/snackbar';
import { useState } from 'react';
import ImagesPicker from '../../../commun/components/images_picker';
import theme from '../../../commun/utils/theme';

export default function OrderForm({orderID, onOrderCreated}) {
  const [open, setOpen] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [dataReady, setDataReady] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  async function createOrder({ address, priceID, cardID, name, phone, image }) {
    try {
      setDisabled(true);
      await makeOrder({
        address: address,
        price_id: priceID,
        cardID: cardID,
        name: name,
        phone: phone,
        image: image,
      });
      setDisabled(false);
      setOpen(false);
      onOrderCreated();
    } catch (error) {
      setDisabled(false);
      setOpen(false);
      setSnackbarMessage(error.message);
      setOpenSnackbar(true);
      throw error;
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
              const priceID = formJson.delivery_price;
              const name = formJson.name;
              const phone = formJson.phone;
              const cardID = orderID;
              const images = formData.getAll('images');
              
              await createOrder({ address, priceID, cardID, name, phone, image: images[0]});
            },
          },
        }}
      >
        <DialogTitle fontFamily={theme.typography.secondaryFontFamily} fontSize={'30px'}>Order</DialogTitle>
        <PromiseBuilder
          promise={getOrderFormData}
          loading={
            <DialogContent>
              <CircularProgress style={{margin: '50px 100px'}}/>
            </DialogContent>
          }
          builder={(data) => {
            const prices = data.deliveryPrices;

            if (!dataReady) {
              setDataReady(true)
            }

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
                    disabled={!dataReady}
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
                    disabled={!dataReady}
                    style={{
                      marginBottom: '20px',
                    }}
                  />
                  <PricesDropdown
                    initialValue={prices[0].id}
                    prices={prices}
                    disabled={!dataReady}
                  />
                  <TextField
                    margin="dense"
                    id="address"
                    name="address"
                    label="Address"
                    type="text"
                    fullWidth
                    variant="standard"
                    disabled={!dataReady}
                    required
                  />
                  <ImagesPicker 
                    disabled={!dataReady} 
                    multiple={false} 
                    title='Delivery Receipt'
                    subTitle={'upload your delivery receipt image here'}
                  />
              </DialogContent>
            );
          }}
        />
        <DialogActions>
          <Button onClick={handleClose} disabled={disabled || !dataReady}>Cancel</Button>
          <Button type='submit' disabled={disabled || !dataReady}>Make Order</Button>
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

const PricesDropdown = ({disabled, initialValue, prices}) => {

  const [value, setValue] = useState(initialValue)

  return (
    <Select
      value={value}
      labelId="delivery-price-label"
      id="delivery-price"
      name="delivery_price"
      label="Delivery Price"
      fullWidth
      variant="standard"
      required
      disabled={disabled}
      IconComponent={() => <KeyboardArrowDownRounded/>}
      onChange={(event) => setValue(event.target.value)}
    >
      {prices.map((price) => (
        <MenuItem key={price.id} value={price.id}>
          {price.state} - {price.price} AMD
        </MenuItem>
      ))}
    </Select>
  );
}