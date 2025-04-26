import { RefreshRounded } from "@mui/icons-material";
import { IconButton, Pagination, Skeleton, styled, Table, TableCell, TableHead, TableRow } from "@mui/material";
import { useState } from "react";
import { PromiseBuilder } from "../../commun/components/promise_builder";
import {getOrders } from "../../services/order";
import EmptyDataComponent from "../../commun/components/empty";
import Order_row from "./components/order_row";
import OrdersStatusTabBar from "./components/order_status_tab_bar";
import SearchField from "../../commun/components/search_field";

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
    position: 'relative',
    bottom: 5,
}))

const ControllContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 40,
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
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10

    const [refreshKey, setRefreshKey] = useState(0);

    return (
        <ContentContainer>
            <div>
                <Title>Orders Board</Title>
                <SubTitle>Here you can adjust you client's orders</SubTitle>
            </div>
            <ControllContainer>
                <SearchField/>
                <OrdersStatusTabBar
                    options={['All', 'Pending', 'In Progress', 'Completed', 'Cancelled']}
                    initialOption={'All'}
                    onChange={(value) => console.log(value)}
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
                                return    <EmptyDataComponent style={{fontWeight: 100}}/>
                            }

                            return orders.map((order) => {
                                return <Order_row key={order.id} order={order} />;
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
        </ContentContainer>
    );
}

export default OrdersBoardPage;