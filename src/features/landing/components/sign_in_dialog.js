import { FacebookRounded, Google } from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { Fragment, useState } from "react";
import { loginWithFacebook, loginWithGoogle } from "../../../services/auth";

export default function SignInDialog() {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Fragment>
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        Sign In
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle fontFamily={'Volkhov'} fontSize={'30px'}>Subscribe</DialogTitle>
        <DialogContent>
          <DialogContentText marginBottom={'20px'}>
            To subscribe to this website, please enter your email address here. We
            will send updates occasionally.
          </DialogContentText>
          <Button
            style={{marginBottom: 10}}
            fullWidth
            variant="outlined"
            onClick={() => loginWithGoogle()}
            startIcon={<Google/>}>  
            Sign in with Google
          </Button>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => loginWithFacebook()}
            startIcon={<FacebookRounded/>}>  
            Sign in with Facebook
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}