import { IconButton, TableCell, TableRow } from "@mui/material";
import { Fragment, use, useEffect, useState } from "react";
import { DeleteRounded, EditRounded } from "@mui/icons-material";
import ActionConfirmationDialog from "../../landing/components/action_confirmation_dialog";
import theme from "../../../commun/utils/theme";
import StatusDrodown from "./status_drop_down";
import { orderStatuses } from "../../../commun/utils/constents";
import { deleteOrder, updateOrder } from "../../../services/order";
import CustomizedSnackbar from "../../../commun/components/snackbar";

const EditibleOrderRow = ({order, onOrderDeleted}) => {
    const [status, setStatus] = useState(order.status);
    const [currentOrder, setCurrentOrder] = useState(order);
    const [error, setError] = useState('');

    useEffect(() => {
        setCurrentOrder(order);
    }, []);

    const handleStatusChange = async () => {
        await updateOrder({id: order.id, status})
        setStatus(status)
        setCurrentOrder((prev) => ({...prev, status}))
    }

    return (
        <TableRow key={order.id}>
            <TableCell sx={{cursor: 'pointer'}}>
                <p style={{fontSize: '16px', fontWeight: 600, textDecoration: 'none'}}>{order.items.map((item) => item.name).join(', ')}</p>
                <p>N° {order.id}</p>
            </TableCell>
            <TableCell>{order.price}DA</TableCell>
            <TableCell>{order.timeAgo}</TableCell>
            <TableCell>
                <StatusDrodown
                    initialValue={order.status}
                    statuses={orderStatuses.filter((status) => status !== 'in_card')}
                    onChange={(value) => setStatus(value)}
                >
                </StatusDrodown>
            </TableCell>
            <TableCell>
                <Fragment>
                    <ActionConfirmationDialog
                        title="Update Order Status"
                        description="Are you sure you want to update this order status?"
                        triggerButton={
                            <IconButton sx={{color: theme.palette.primary.main}} disabled={status === currentOrder.status}>
                                <EditRounded/>
                            </IconButton>
                        }
                        onConfirm={async () => await handleStatusChange(status)}
                    />
                    <ActionConfirmationDialog
                        title="Delete Order"
                        description="Are you sure you want to delete this order?"
                        triggerButton={
                            <IconButton sx={{color: theme.palette.error.main}}>
                                <DeleteRounded/>
                            </IconButton>
                        }
                        onConfirm={async () => {
                            await deleteOrder(order.id)
                            onOrderDeleted()
                        }}
                    />
                </Fragment>
            </TableCell>
            <CustomizedSnackbar
                open={Boolean(error)}
                message={error}
                handleClose={() => setError('')}
                type={'error'}
            />
        </TableRow>
    );
}

export default EditibleOrderRow;
 