import { RefreshRounded } from "@mui/icons-material";
import { IconButton, Pagination, Skeleton, styled, Table, TableCell, TableHead, TableRow } from "@mui/material";
import { useEffect, useState } from "react";
import { PromiseBuilder } from "../../commun/components/promise_builder";
import {getOrders } from "../../services/order";
import EmptyDataComponent from "../../commun/components/empty";
import SearchField from "../../commun/components/search_field";
import StatusDrodown from "./components/status_drop_down";
import EditibleOrderRow from "./components/editible_order_row";
import { orderStatuses } from "../../commun/utils/constents";
import { useSearchParams } from "react-router-dom";
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
    marginLeft: 'auto'
}))

const ControllContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 40,
    gap: 20,
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

const OrdersBoardPage = () => {
    const pageSize = 10

    const [refreshKey, setRefreshKey] = useState(0);

    const [filters, setFilters] = useState({
        query: '',
        page: 1,
    });

    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        const query = searchParams.get("query") || '';
        const page = searchParams.get("page") || 1;
        const status = searchParams.get("status") || 'All';
        setFilters({query, page, status });
    }, [searchParams]);

    const updateUrlFilters = (updatedFilters) => {
        const params = {};
        if (updatedFilters.query) params.query = updatedFilters.query;
        if (updatedFilters.page) params.page = updatedFilters.page;
        if (updatedFilters.status) params.status = updatedFilters.status;
        setSearchParams(params);
    };

    const handleFilterChange = (key, value) => {
        let selectedValues;
        switch (key) {
            case "query":
                selectedValues = value || '';
                break;
            case "page":
                selectedValues = value || 1;
                break;
            case "status":
                selectedValues = value === 'All' ? '' : value;
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
                <title>Client's Orders</title>
                <meta name="description" content="Manage and adjust your client's orders efficiently on the Orders Board." />
                <meta name="keywords" content="orders, management, client orders, admin panel" />
                <meta name="author" content="Your Company Name" />
            </Helmet>
            <div>
                <Title>Orders Board</Title>
                <SubTitle>Here you can adjust you client's orders</SubTitle>
            </div>
            <ControllContainer>
                <SearchField
                    placeholder="Enter order ID..."
                    defaultValue={filters.id}
                    onValueChanged={(value) => {
                        handleFilterChange('page', 1);
                        handleFilterChange('id', value);
                    }}
                />
                <StatusDrodown
                    initialValue={filters.status}
                    borderType="box"
                    statuses={['All', ...orderStatuses.filter((status) => status !== 'in_card')]}
                    onChange={(status) => handleFilterChange('status', status)}
                />
                <RefreshButton onClick={async () => setRefreshKey(refreshKey + 1)}>
                    <RefreshRounded/>
                </RefreshButton>
            </ControllContainer>
            <TableScroller>
                <OrdersTable>
                    <TableHeader>
                        <TableRow>
                            <TableHeaderTitles>Product</TableHeaderTitles>
                            <TableHeaderTitles>Price</TableHeaderTitles>
                            <TableHeaderTitles>Time</TableHeaderTitles>
                            <TableHeaderTitles>Status</TableHeaderTitles>
                            <TableHeaderTitles>State</TableHeaderTitles>
                            <TableCell/>
                        </TableRow>
                    </TableHeader>
                    <PromiseBuilder
                        promise={() => getOrders({
                            pageSize, 
                            currentPage: filters.page, 
                            status: filters.status, 
                            id: filters.id, 
                            isAdmin: true
                        })}
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
                                    <TableCell>
                                        <Skeleton variant="text" width="30%" height={20} />
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                        builder={(data) => {
                            const orders = data.orders;
                            
                            if (!orders || orders.length === 0) {
                                return <EmptyDataComponent style={{fontWeight: 100}}/>
                            }

                            return orders.map((order) => {
                                return <EditibleOrderRow 
                                    key={order.id} 
                                    order={order} 
                                />;
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

export default OrdersBoardPage;