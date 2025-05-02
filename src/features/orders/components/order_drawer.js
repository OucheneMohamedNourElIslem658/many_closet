import { ArrowForwardRounded, CloseRounded, DeleteRounded, LinkRounded, PreviewOutlined } from "@mui/icons-material";
import { Box, Drawer, IconButton, Skeleton, styled } from "@mui/material";
import OrderForm from "./order_form";
import { PromiseBuilder } from "../../../commun/components/promise_builder";
import { getOrder, removeItemFromCard } from "../../../services/order";
import EmptyDataComponent from "../../../commun/components/empty";
import { useState } from "react";
import ActionConfirmationDialog from "../../landing/components/action_confirmation_dialog";

const CloseButton = styled(IconButton)({
    position: 'absolute',
    top: 5,
    right: 5,
})

const Title = styled('h1')(({ theme }) => ({
    fontSize: 35,
    fontWeight: 100,
    color: theme.palette.text.primary,
    marginBottom: 5,
}))

const ItemsUpdate = styled('p')(({ theme }) => ({
    fontSize: 16,
    fontWeight: 400,
    color: theme.palette.text.secondary,
    fontFamily: theme.typography.fontFamily,
    marginBottom: 10,
    '& strong': {
        color: theme.palette.primary.main,
    },
}))

const OrderItem = styled('li')(({ theme }) => ({
    display: 'flex',
    gap: 10,
    padding: '20px 0',
    borderBottom: `1px solid ${theme.palette.grey[300]}`,
    listStyleType: 'none',
}))

const ItemImage = styled('div')({
    width: 150,
    height: 200,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
})

const ItemName = styled('h2')(({ theme }) => ({
    fontSize: 20,
    fontWeight: 400,
    color: theme.palette.primary.main,
}))

const ItemInfo = styled('p')(({ theme }) => ({
    fontSize: 18,
    fontWeight: 400,
    color: theme.palette.secondary.main,
    fontFamily: theme.typography.fontFamily,
}))

const ItemPrice = styled('p')(({ theme }) => ({
    fontSize: 18,
    fontWeight: 400,
    color: theme.palette.primary.main,
    fontFamily: theme.typography.fontFamily,
}))

const ItemsList = styled('ul')(({ theme }) => ({
    listStyleType: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
}))

const PaymentContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    right: 0,
    bottom: 0,
    width: '80vw',
    gap: 10,
    backgroundColor: theme.palette.background.paper,
    padding: '20px 20px',
    maxWidth: 550,
    borderTop: `1px solid ${theme.palette.grey[300]}`,
    [theme.breakpoints.down('sm')]: {
        padding: '10px 20px',
        gap: 0
    }
}))

const PriceInfo = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    padding: '5px 0',
    fontSize: 16,
    fontWeight: 400,
    '& p': {
        fontFamily: theme.typography.fontFamily,
    },
    '& h3': {
        fontWeight: 400,
        whiteSpace: 'nowrap'
    },
    [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
        alignItems: 'start',
        gap: 3
    }
}))

const DeleteButton = styled(IconButton)(({theme}) => ({
    color: theme.palette.error.main,
}))

const OrdersDrawer = ({open, onClose, orderID, onOrderCreated}) => {
    const [refreshKey, setRefreshKey] = useState(0)

    return ( 
        <Drawer
            anchor='right'
            open={open}
            onClose={onClose}
        >
            <Box sx={{width: '80vw', maxWidth: 550}} role="presentation" padding={'20px'}>
                <CloseButton onClick={onClose}>
                    <CloseRounded style={{color: 'black'}}/>
                </CloseButton>
                {open && <PromiseBuilder
                    promise={() => getOrder({id: orderID})}
                    loading={
                        <div>
                            <Skeleton variant="text" width={200} height={50} />
                            <Skeleton variant="text" width={250} height={30} />
                            <ItemsList>
                                {Array.from({ length: 3 }).map((_, index) => (
                                    <OrderItem key={index}>
                                        <ItemImage style={{ backgroundColor: '#e0e0e0' }} />
                                        <div>
                                            <Skeleton variant="text" width={100} height={40} />
                                            <Skeleton variant="text" width={150} />
                                            <Skeleton variant="text" width={120} />
                                            <Skeleton variant="text" width={80} />
                                        </div>
                                    </OrderItem>
                                ))}
                            </ItemsList>
                        </div>
                    }
                    builder={(order) => {
                        if (!order || !order.items || order.items.length === 0) {
                            return <EmptyDataComponent message={'there is no items here yet'}/>
                        }

                        const isMyCard = order && order.status === 'in_card'
                        
                        const title = isMyCard ? 'My Card' : 'Order: ' + order.status;

                        return (
                            <div style={{position: 'relative'}}>
                                <div>
                                    <Title>{title}</Title>
                                    {
                                        !isMyCard ? <ItemsUpdate>The order was last updated {order.timeAgo} </ItemsUpdate> : null
                                    }
                                </div>
                                <ItemsList>
                                    {
                                        order.items && order.items.map((item, index) => (
                                            <div style={{display: 'flex', gap: 10, justifyContent: 'space-between', alignItems: 'center'}} key={index}>
                                                <OrderItem key={index}>
                                                    <ItemImage style={{backgroundImage: `url(${item.picURL})`}}/>
                                                    <div>
                                                        <h1 style={{fontSize: 40}}>{item.quantity}</h1>
                                                        <ItemName>{item.name}</ItemName>
                                                        <ItemInfo>Color: {item.color}</ItemInfo>
                                                        <ItemInfo>Size: {item.size}</ItemInfo>
                                                        <ItemPrice>Price: {item.price}DA</ItemPrice>
                                                    </div>
                                                </OrderItem>
                                                {
                                                    isMyCard && <ActionConfirmationDialog
                                                        title='Remove Item'
                                                        description='Are you sure you want to remove this item from your card?'
                                                        triggerButton={
                                                            <DeleteButton>
                                                                <DeleteRounded style={{height: 30, width: 30}}/>
                                                            </DeleteButton>
                                                        }
                                                        onConfirm={async () => {
                                                            await removeItemFromCard(item.id)
                                                            setRefreshKey(refreshKey + 1)
                                                        }}
                                                    />
                                                }
                                            </div>
                                        ))
                                    }
                                </ItemsList>
                                <PaymentContainer>
                                    {
                                        !isMyCard && <PriceInfo>
                                                        <h3>Delivery Address:</h3>
                                                        <p>{order.address}</p>
                                                    </PriceInfo>
                                    }
                                    {
                                        !isMyCard && <PriceInfo>
                                                        <h3>Shipping cost:</h3>
                                                        <p>{order.shippment_price}DA</p>
                                                    </PriceInfo>
                                    }
                                    <PriceInfo>
                                        <h3>Items cost:</h3>
                                        <p>{order.itemsPrice}DA</p>
                                    </PriceInfo>
                                    {
                                        !isMyCard && <PriceInfo>
                                            <h3>Total:</h3>
                                            <p>{order.price}DA</p>
                                        </PriceInfo>
                                    }
                                    {
                                        isMyCard && <OrderForm orderID={order.id} onOrderCreated={onOrderCreated}/>
                                    }
                                    {
                                        order.receipt && <PriceInfo>
                                            <h3>Receipt:</h3>
                                            <IconButton onClick={() => window.open(order.receipt.url, '_blank')} style={{borderRadius: 5, padding: 0}}>
                                                <LinkRounded style={{color: 'black'}} fontSize="large"/>
                                            </IconButton>
                                        </PriceInfo>
                                    }
                                </PaymentContainer>
                            </div>
                    )}}/>}
            </Box>
        </Drawer>
    );
}
 
export default OrdersDrawer;