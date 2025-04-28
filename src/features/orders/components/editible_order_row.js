import { IconButton, TableCell, TableRow } from "@mui/material";
import { Fragment, useState } from "react";
import { DeleteRounded, EditRounded } from "@mui/icons-material";
import ActionConfirmationDialog from "../../landing/components/action_confirmation_dialog";
import theme from "../../../commun/utils/theme";
import StatusDrodown from "./status_drop_down";
import { orderStatuses } from "../../../commun/utils/constents";
import { updateOrder } from "../../../services/order";

const EditibleOrderRow = ({order, onOrderUpdated}) => {
    const [status, setStatus] = useState(order.status);

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
                            <IconButton sx={{color: theme.palette.primary.main}} disabled={status === order.status}>
                                <EditRounded/>
                            </IconButton>
                        }
                        onConfirm={async () => {
                            await updateOrder({id: order.id, status})
                            onOrderUpdated()
                        }}
                    />
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

export default EditibleOrderRow;
 