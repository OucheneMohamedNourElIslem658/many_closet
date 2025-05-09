import { DeleteRounded, RefreshRounded } from "@mui/icons-material";
import { IconButton, Pagination, Skeleton, styled, Table, TableCell, TableHead, TableRow } from "@mui/material";
import theme from "../../commun/utils/theme";
import OrdersDrawer from "./components/order_drawer";
import { useState } from "react";
import { PromiseBuilder } from "../../commun/components/promise_builder";
import {deleteOrder, getOrders } from "../../services/order";
import EmptyDataComponent from "../../commun/components/empty";
import { useEffect } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import ActionConfirmationDialog from "../landing/components/action_confirmation_dialog";
import { Helmet } from "react-helmet";

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
    fontFamily: theme.typography.secondaryFontFamily,
}))

const TableHeaderTitles = styled(TableCell)(({ theme }) => ({
    fontSize: 18,
    fontWeight: 400,
    fontFamily: theme.typography.secondaryFontFamily,
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
    const pageSize = 10
    const [refreshKey, setRefreshKey] = useState(0);

    const [filters, setFilters] = useState({
        page: 1,
    });

    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        const page = searchParams.get("page") || 1;
        setFilters({ page });
    }, [searchParams,]);

    const updateUrlFilters = (updatedFilters) => {
        const params = {};
        if (updatedFilters.page) params.page = updatedFilters.page;
        setSearchParams(params);
    };

    const handleFilterChange = (key, value) => {
        let selectedValues;
        switch (key) {
            case "page":
                selectedValues = value || 1;
                break;
            default:
                selectedValues = value;
        }

        const updatedFilters = { ...filters, [key]: selectedValues };
        setFilters(updatedFilters);
        updateUrlFilters(updatedFilters);
    };

    return (
        <ContentContainer>
            <Helmet>
                <title>My Orders</title>
                <meta name="description" content="View and manage your past orders. Check order details, status, and more." />
                <meta name="keywords" content="orders, order history, manage orders, view orders" />
                <meta name="author" content="Your Company Name" />
            </Helmet>
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
                        promise={() => getOrders({pageSize, currentPage: filters.page})}
                        loading={
                            Array.from({ length: 5 }).map((_, index) => (
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
                                return <EmptyDataComponent style={{fontWeight: 100}} message={'you do not have any orders yet'}/>
                            }

                            return orders.map((order) => {
                                return <OrderRow key={order.id} order={order} />;
                            }).concat(
                                <TableRow key="pagination">
                                    <TableCell sx={{ borderBottom: "none"}} colSpan={5}>
                                        <PaginationController 
                                            style={{justifySelf: 'center'}} 
                                            count={data.maxPages} 
                                            page={filters.page}
                                            onChange={(_, page) => handleFilterChange('page', page)} 
                                        />
                                    </TableCell>
                                </TableRow>
                            );
                        }}
                    />
                </OrdersTable>
            </TableScroller>
        </ContentContainer>
    );
}

const OrderRow = ({ order }) => {
    const [open, setOpen] = useState(false);
    const { id } = useParams();
    const [showOrder, setShowOrder] = useState(true);

    useEffect(() => {
        if (id === order.id) {
            setOpen(true);
        }
    }, [id, order.id]);

    const handleDrawerClose = () => {
        setOpen(false);
        window.history.pushState({}, '', '/orders');
    };

    return (
        <TableRow key={order.id} style={{ display: showOrder ? 'table-row' : 'none' }}>
            <TableCell 
                component={Link} 
                to={`/orders/${order.id}`} 
                sx={{ cursor: 'pointer' }} 
                onClick={(e) => {
                    e.preventDefault();
                    window.history.pushState({}, '', `/orders/${order.id}`);
                    setOpen(true);
                }}
            >
                <p 
                    style={{ 
                        fontSize: '16px', 
                        fontWeight: 600, 
                        textDecoration: 'none',
                    }}>
                        {order.items.map((item) => item.name).join(', ')}
                </p>
                <p>N° {order.id}</p>
            </TableCell>
            <TableCell>{order.price}DA</TableCell>
            <TableCell style={{whiteSpace: 'nowrap'}}>{order.timeAgo}</TableCell>
            <TableCell>{order.status}</TableCell>
            <TableCell>
                {
                    order.status === 'pending' && <ActionConfirmationDialog
                        title="Delete Order"
                        description="Are you sure you want to delete this order?"
                        triggerButton={
                            <IconButton sx={{ color: theme.palette.error.main }}>
                                <DeleteRounded />
                            </IconButton>
                        }
                        onConfirm={async () => {
                            await deleteOrder(order.id)
                      
                            setShowOrder(false)
                        }}
                    />
                }
            </TableCell>
            <OrdersDrawer
                open={open}
                onClose={handleDrawerClose}
                orderID={order.id}
            />
        </TableRow>
    );
};
 
export default OrdersPage;