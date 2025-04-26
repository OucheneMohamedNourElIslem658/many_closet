import { IconButton, MenuItem, Select, TableCell, TableRow } from "@mui/material";
import { Fragment, useState } from "react";
import { DeleteRounded, KeyboardArrowDownRounded } from "@mui/icons-material";
import ActionConfirmationDialog from "../../landing/components/action_confirmation_dialog";
import theme from "../../../commun/utils/theme";

const OrderRow = ({order}) => {
    const [open, setOpen] = useState(false);

    return (
        <TableRow key={order.id}>
            <TableCell onClick={() => setOpen(true)} sx={{cursor: 'pointer'}}>
                <p style={{fontSize: '16px', fontWeight: 600, textDecoration: 'none'}}>{order.items.map((item) => item.name).join(', ')}</p>
                <p>N° {order.id}</p>
            </TableCell>
            <TableCell>{order.price}DA</TableCell>
            <TableCell>{order.timeAgo}</TableCell>
            <TableCell>
                <StatusDrodown
                    initialValue={order.status}
                    statuses={['pending', 'delivered', 'canceled']}
                >
                </StatusDrodown>
            </TableCell>
            <TableCell>
                <Fragment>
                    <ActionConfirmationDialog
                        title="Delete Order"
                        description="Are you sure you want to delete this order?"
                        triggerButton={
                            <IconButton sx={{color: theme.palette.error.main}}>
                                <DeleteRounded/>
                            </IconButton>
                        }
                        onConfirm={() => {}}
                    />
                </Fragment>
            </TableCell>
        </TableRow>
    );
}

const StatusDrodown = ({disabled, initialValue, statuses}) => {

    const [value, setValue] = useState(initialValue)
  
    return (
      <Select
        value={value}
        id="status"
        name="status"
        fullWidth
        variant="standard"
        required
        disabled={disabled}
        IconComponent={() => <KeyboardArrowDownRounded/>}
        onChange={(event) => setValue(event.target.value)}
        sx={{ width: 150 }}
      >
        {statuses.map((status) => (
          <MenuItem key={status} value={status}>
            {status}
          </MenuItem>
        ))}
      </Select>
    );
}

export default OrderRow;
 