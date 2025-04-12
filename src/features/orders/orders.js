import { DeleteRounded, EditRounded, RefreshRounded } from "@mui/icons-material";
import { IconButton, Pagination, styled, Table, TableCell, TableHead, TableRow } from "@mui/material";
import theme from "../../commun/utils/theme";
import OrdersDrawer from "./components/order_drawer";
import { useState } from "react";

const ContentContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    maxWidth: '1200px',
    justifySelf: 'center',
    width: '100%',
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


const OrdersPage = () => {
    const orders = [
        {
            id: 11225855599,
            price: 200,
            timeAgo: '2 days ago',
            status: 'delivered',
        },
        {
            id: 11225855599,
            price: 100,
            timeAgo: '5 days ago',
            status: 'delivered',
        },
        {
            id: 11225855599,
            price: 300,
            timeAgo: '1 week ago',
            status: 'delivered',
        },
    ]

    const [open, setOpen] = useState(false);

    return (
        <ContentContainer>
            <div>
                <Title>Orders</Title>
                <SubTitle>Here you can view your past orders.</SubTitle>
            </div>
            <RefreshButton>
                <RefreshRounded/>
            </RefreshButton>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHeaderTitles>Product Number</TableHeaderTitles>
                        <TableHeaderTitles>Price</TableHeaderTitles>
                        <TableHeaderTitles>Time</TableHeaderTitles>
                        <TableHeaderTitles>Status</TableHeaderTitles>
                        <TableCell/>
                    </TableRow>
                </TableHeader>
                {
                    orders.map((order) => (
                        <TableRow key={order.id} onClick={() => setOpen(true)} style={{cursor: 'pointer'}}>
                            <TableCell>{order.id}</TableCell>
                            <TableCell>{order.price}</TableCell>
                            <TableCell>{order.timeAgo}</TableCell>
                            <TableCell>{order.status}</TableCell>
                            <TableCell>
                                <IconButton>
                                    <EditRounded style={{color: '#5B86E5'}}/>
                                </IconButton>
                                <IconButton>
                                    <DeleteRounded style={{color: theme.palette.error.main}}/>
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))
                }
            </Table>
            <OrdersDrawer 
                open={open}
                onClose={() => setOpen(false)}
                order={orders[0]}
            />
            <PaginationController count={10}/>
        </ContentContainer>
    );
}
 
export default OrdersPage;