import { DeleteRounded, RefreshRounded } from "@mui/icons-material";
import { IconButton, Pagination, styled, Table, TableCell, TableHead, TableRow } from "@mui/material";
import theme from "../../commun/utils/theme";
import OrdersDrawer from "./components/order_drawer";
import { useState } from "react";
import SearchField from "../../commun/components/search_field";
import ConfirmationDialog from "../../commun/components/confirmation_dialog";
import { PromiseBuilder } from "../../commun/components/promise_builder";
import { getOrder, getOrders } from "../../services/order";

const ContentContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    maxWidth: '1200px',
    justifySelf: 'center',
    margin: '0 auto',
    padding: '0 20px'
}))

const Title = styled('h1')(({ theme }) => ({
    fontSize: 35,
    fontWeight: 100,
    color: theme.palette.text.primary,
    marginBottom: 8
}))

const SubTitle = styled('p')(({ theme }) => ({
    fontSize: 16,
    color: theme.palette.text.secondary,
    fontFamily: theme.typography.fontFamily,
    marginBottom: 40,
}))

const TableHeader = styled(TableHead)(({ theme }) => ({
    fontSize: 18,
    fontWeight: 400,
    fontFamily: 'Volkhov',
}))

const TableHeaderTitles = styled(TableCell)(({ theme }) => ({
    fontSize: 18,
    fontWeight: 400,
    fontFamily: 'Volkhov',
}))

const RefreshButton = styled(IconButton)(({ theme }) => ({
    alignSelf: 'end',
    color: theme.palette.primary.main,
}))

const PaginationController = styled(Pagination)(({ theme }) => ({
    marginTop: 40,
}))

const SearchController = styled('div')({
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20
})

const OrdersTable = styled(Table)({
    minWidth: 650,
    width: '100%'
})

const TableScroller = styled('div')({
    width: '100%', 
    overflow: 'scroll',
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': {
        display: 'none',
    },
})

const OrdersPage = () => {
    const orders = [
        {
            id: 11225855599,
            price: 200,
            timeAgo: '2 days ago',
            status: 'delivered',
            itemsNames: [
                "T-shirt", "Jeans", "Sneakers"
            ]
        },
        {
            id: 11225855600,
            price: 100,
            timeAgo: '5 days ago',
            status: 'delivered',
            itemsNames: [
                "Jacket", "Scarf"
            ]
        },
        {
            id: 11225855601,
            price: 300,
            timeAgo: '1 week ago',
            status: 'delivered',
            itemsNames: [
                "Dress", "Heels", "Handbag"
            ]
        },
    ]

    const [open, setOpen] = useState(false);
    const [orderID, setOrderID] = useState(null);

    return (
        <ContentContainer>
            <div>
                <Title>Orders</Title>
                <SubTitle>Here you can view your past orders.</SubTitle>
            </div>
            <SearchController>
                <SearchField/>
                <RefreshButton onClick={async () => await getOrder('6802abd900263131e6d8')}>
                    <RefreshRounded/>
                </RefreshButton>
            </SearchController>
            <TableScroller>
                <OrdersTable>
                    <TableHeader>
                        <TableRow>
                            <TableHeaderTitles>Product</TableHeaderTitles>
                            <TableHeaderTitles>Price</TableHeaderTitles>
                            <TableHeaderTitles>Time</TableHeaderTitles>
                            <TableHeaderTitles>Status</TableHeaderTitles>
                            <TableCell/>
                        </TableRow>
                    </TableHeader>
                    <PromiseBuilder
                        promise={() => getOrders()}
                        builder={(orders) => {
                            return orders.map((order) => {
                                const itemsNames = order.items.map((item) => {
                                    return item.name
                                })

                                return <TableRow key={order.$id} style={{cursor: 'pointer'}}>
                                    <TableCell onClick={() => {
                                        setOrderID(order.$id)
                                        setOpen(true)
                                    }}>
                                        <p style={{fontSize: '16px', fontWeight: 600}}>{itemsNames.join(', ')}</p>
                                        <p>N° {order.id}</p>
                                    </TableCell>
                                    <TableCell>{order.price}DA</TableCell>
                                    <TableCell>{order.timeAgo}</TableCell>
                                    <TableCell>{order.status}</TableCell>
                                    <TableCell>
                                        <ConfirmationDialog
                                            button={<IconButton>
                                                <DeleteRounded style={{color: theme.palette.error.main}}/>
                                            </IconButton>}
                                            onConfirm={() => {}}
                                            title="Delete Order"
                                            description="Are you sure you want to delete this order?"
                                        />
                                    </TableCell>
                                </TableRow>
                            })
                            }
                        }
                    />
                </OrdersTable>
            </TableScroller>
            <OrdersDrawer 
                open={open}
                onClose={() => setOpen(false)}
                orderID={orderID}
            />
            <PaginationController count={10}/>
        </ContentContainer>
    );
}
 
export default OrdersPage;