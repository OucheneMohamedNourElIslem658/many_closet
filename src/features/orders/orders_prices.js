import { AddRounded, DeleteRounded, EditRounded, RefreshRounded } from "@mui/icons-material";
import { Fab, IconButton, Pagination, Skeleton, styled, Table, TableCell, TableHead, TableRow, TextField } from "@mui/material";
import theme from "../../commun/utils/theme";
import OrdersDrawer from "./components/order_drawer";
import { Fragment, useState } from "react";
import { PromiseBuilder } from "../../commun/components/promise_builder";
import {deleteOrder, editDeliveryPrice, getOrders, getOrdersPrices } from "../../services/order";
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
    padding: '0 20px',
    position: 'relative',
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

const AddProductButton = styled(Link)(({ theme }) => ({
    position: 'sticky',
    bottom: 20,
    right: 20,
    alignSelf: 'end',
    [theme.breakpoints.down('sm')]: {
        bottom: 80,
    }
}))

const OrdersPrices = () => {
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
                <title>Delivery Prices</title>
                <meta name="description" content="View and manage your delivery prices." />
                <meta name="keywords" content="orders, prices, management, delivery" />
            </Helmet>
            <div>
                <Title>Delivery Prices</Title>
                <SubTitle>Here you can adjust the delivery prices by state</SubTitle>
            </div>
            <RefreshButton onClick={async () => setRefreshKey(refreshKey + 1)}>
                <RefreshRounded/>
            </RefreshButton>
            <TableScroller>
                <OrdersTable>
                    <TableHeader>
                        <TableRow>
                            <TableHeaderTitles>State</TableHeaderTitles>
                            <TableHeaderTitles>Price</TableHeaderTitles>
                            <TableCell/>
                        </TableRow>
                    </TableHeader>
                    <PromiseBuilder
                        promise={() => getOrdersPrices({pageSize, currentPage: filters.page})}
                        loading={
                            Array.from({ length: 5 }).map((_, index) => (
                                <TableRow key={`skeleton-${index}`}>
                                    <TableCell>
                                        <Skeleton variant="text" width="50%" height={20} />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton variant="text" width="60%" height={20} />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton variant="text" width="20%" height={20} />
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                        builder={(data) => {
                            const prices = data.prices;
                            
                            if (!prices || prices.length === 0) {
                                return <EmptyDataComponent style={{fontWeight: 100}} message={'you do not have any prices yet'}/>
                            }

                            return prices.map((price) => {
                                return <OrderPriceRow key={price.id} orderPrice={price} />;
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
            <AddProductButton to="/admin/orders/create">
                <Fab 
                    color="primary" 
                    aria-label="add"
                >
                    <AddRounded/>
                </Fab>
            </AddProductButton>

        </ContentContainer>
    );
}

const OrderPriceRow = ({ orderPrice }) => {
    const [currentOrderPrice, setCurrentOrderPrice] = useState(orderPrice);
    const [oldOrderPrice, setOldOrderPrice] = useState(orderPrice);
    const [isEdited, setIsEdited] = useState(false);

    const handleInputChange = (key, value) => {
        setCurrentOrderPrice((prev) => {
            const updated = { ...prev, [key]: value };
            setIsEdited(
                updated.state !== oldOrderPrice.state || updated.price !== oldOrderPrice.price
            );
            return updated;
        });
    };

    const handleUpdateConfirm = async () => {
        const newOrderPrice = {
            id: currentOrderPrice.id,
            newPrice: Number(currentOrderPrice.price),
            newState: currentOrderPrice.state,
        };

        await editDeliveryPrice(newOrderPrice);
        setOldOrderPrice(currentOrderPrice);
        setIsEdited(false);
    };

    return (
        <TableRow key={orderPrice.id}>
            <TableCell>
                <TextField
                    value={currentOrderPrice.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                    size="small"
                    slotProps={{
                        htmlInput: {
                            maxLength: 20,
                        },
                    }}
                />
            </TableCell>
            <TableCell>
                <TextField
                    value={currentOrderPrice.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    size="small"
                    type="number"
                    slotProps={{
                        htmlInput: {
                            min: 0,
                            max: 10000,
                        },
                    }}
                />
            </TableCell>
            <TableCell
                style={{
                    display: "flex",
                    justifyContent: "end",
                }}
            >
                <ActionConfirmationDialog
                    title="Update Order Price"
                    description="Are you sure you want to update this order price?"
                    triggerButton={
                        <IconButton sx={{ color: theme.palette.primary.main }} disabled={!isEdited}>
                            <EditRounded />
                        </IconButton>
                    }
                    onConfirm={async () => handleUpdateConfirm()}
                />
            </TableCell>
        </TableRow>
    );
};
 
export default OrdersPrices;