import { DeleteRounded, RefreshRounded } from "@mui/icons-material";
import { IconButton, Pagination, Skeleton, styled, Table, TableCell, TableHead, TableRow } from "@mui/material";
import theme from "../../commun/utils/theme";
import OrdersDrawer from "./components/order_drawer";
import { useState } from "react";
import ConfirmationDialog from "../../commun/components/confirmation_dialog";
import { PromiseBuilder } from "../../commun/components/promise_builder";
import {getOrders } from "../../services/order";
import EmptyDataComponent from "../../commun/components/empty";

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
    const [open, setOpen] = useState(false);
    const [orderID, setOrderID] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10

    const [refreshKey, setRefreshKey] = useState(0);

    return (
        <ContentContainer>
            <div>
                <Title>Orders</Title>
                <SubTitle>Here you can view your past orders.</SubTitle>
            </div>
            <RefreshButton onClick={async () => setRefreshKey(refreshKey + 1)}>
                <RefreshRounded/>
            </RefreshButton>
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
                        promise={() => getOrders({pageSize, currentPage})}
                        loading={
                            Array.from({ length: pageSize }).map((_, index) => (
                                <TableRow key={`skeleton-${index}`}>
                                    <TableCell>
                                        <Skeleton variant="text" width="80%" height={20} />
                                        <Skeleton variant="text" width="50%" height={14} />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton variant="text" width="50%" height={20} />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton variant="text" width="60%" height={20} />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton variant="text" width="40%" height={20} />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton variant="text" width="30%" height={20} />
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                        builder={(data) => {
                            const orders = data.orders;

                            if (!orders || orders.length === 0) {
                                return <EmptyDataComponent/>
                                
                            }

                            return orders.map((order) => {
                                const itemsNames = order.items.map((item) => {
                                    return item.name;
                                });

                                return <TableRow key={order.id} style={{cursor: 'pointer'}}>
                                    <TableCell onClick={() => {
                                        setOrderID(order.id);
                                        setOpen(true);
                                    }}>
                                        <p style={{fontSize: '16px', fontWeight: 600, textDecoration: 'none'}}>{itemsNames.join(', ')}</p>
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
                                </TableRow>;
                            }).concat(
                                <TableRow key="pagination">
                                    <TableCell sx={{ borderBottom: "none"}} colSpan={5}>
                                        <PaginationController 
                                            style={{justifySelf: 'center'}} 
                                            count={data.maxPages} 
                                            page={currentPage}
                                            onChange={(_, page) => setCurrentPage(page)} 
                                        />
                                    </TableCell>
                                </TableRow>
                            );
                        }}
                    />
                </OrdersTable>
            </TableScroller>
            <OrdersDrawer 
                open={open}
                onClose={() => setOpen(false)}
                orderID={orderID}
            />
        </ContentContainer>
    );
}
 
export default OrdersPage;