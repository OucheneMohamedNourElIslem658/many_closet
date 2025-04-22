import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export default function CustomizedSnackbar({message, type, open, handleClose}) {

  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert
            onClose={handleClose}
            severity={type}
            variant="filled"
            sx={{ width: '100%' }}
        >
        {message}
        </Alert>
    </Snackbar>
  );
}
