import { CloseRounded } from "@mui/icons-material";
import { Box, Drawer, IconButton, styled } from "@mui/material";
import OrderForm from "./order_form";
import { PromiseBuilder } from "../../../commun/components/promise_builder";
import { getOrder } from "../../../services/order";

const CloseButton = styled(IconButton)({
    position: 'absolute',
    top: 5,
    right: 5,
})

const Title = styled('h1')(({ theme }) => ({
    fontSize: 35,
    fontWeight: 100,
    color: theme.palette.text.primary,
    margin: 0,
}))

const ItemsCost = styled('p')(({ theme }) => ({
    fontSize: 20,
    fontWeight: 400,
    color: theme.palette.text.secondary,
    fontFamily: theme.typography.fontFamily,
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
    gap: 10,
    position: 'sticky',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: theme.palette.background.paper,
    borderTop: `1px solid ${theme.palette.grey[300]}`,
}))

const PriceInfo = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    padding: '5px 0',
    fontSize: 18,
    fontWeight: 400,
}))

const OrdersDrawer = ({open, onClose, orderID}) => {
    // const order = {
    //     items: [
    //         {
    //             name: 'Denim Jacket',
    //             price: 200,
    //             quantity: 2,
    //             color: 'black',
    //             size: 'L',
    //             picURL: 'https://images.unsplash.com/photo-1540221652346-e5dd6b50f3e7?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2xvdGhpbmd8ZW58MHx8MHx8fDA%3D',
    //         },
    //         {
    //             name: 'White T-shirt',
    //             price: 100,
    //             quantity: 1,
    //             color: 'white',
    //             size: 'M',
    //             picURL: 'https://images.unsplash.com/photo-1509319117193-57bab727e09d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y2xvdGhpbmd8ZW58MHx8MHx8fDA%3D',
    //         },
    //         {
    //             name: 'Black Sneakers',
    //             price: 300,
    //             quantity: 1,
    //             color: 'black',
    //             size: '42',
    //             picURL: 'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y2xvdGhpbmd8ZW58MHx8MHx8fDA%3D',
    //         },
    //         // {
    //         //     name: 'Blue Jeans',
    //         //     price: 150,
    //         //     quantity: 1,
    //         //     color: 'blue',
    //         //     size: '32',
    //         //     picURL: 'https://plus.unsplash.com/premium_photo-1675186049222-0b5018db6ce9?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y2xvdGhpbmd8ZW58MHx8MHx8fDA%3D',
    //         // }
    //     ],
    // }


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
                <PromiseBuilder
                    promise={() => getOrder(orderID)}
                    builder={(order) => {
                        return (
                            <div>
                                <div>
                                    <Title>Orders</Title>
                                    <ItemsCost>The items you picked cost you <strong>2000DA</strong> </ItemsCost>
                                </div>
                                <ItemsList>
                                    {
                                        order.items && order.items.map((item, index) => (
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
                                        ))
                                    }
                                </ItemsList>
                                <PaymentContainer>
                                    <PriceInfo>
                                        <p>Shipping cost:</p>
                                        <p>200DA</p>
                                    </PriceInfo>
                                    <PriceInfo>
                                        <p>Total:</p>
                                        <p>2200DA</p>
                                    </PriceInfo>
                                    <OrderForm/>
                                </PaymentContainer>
                            </div>
                    )}}/>
            </Box>
        </Drawer>
    );
}
 
export default OrdersDrawer;