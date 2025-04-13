import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function OrderForm() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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
            onSubmit: (event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              const formJson = Object.fromEntries(formData.entries());
              const email = formJson.email;
              console.log(email);
              handleClose();
            },
          },
        }}
      >
        <DialogTitle fontFamily={'Volkhov'} fontSize={'30px'}>Order</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Fill in the form below to make an order.
          </DialogContentText>
            <TextField
                margin="dense"
                id="name"
                name="name"
                label="Full Name (optional)"
                type="text"
                fullWidth
                variant="standard"
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
        />
            <TextField
                margin="dense"
                id="address"
                name="address"
                label="Address"
                type="text"
                fullWidth
                variant="standard"
                required
            />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Make Order</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}