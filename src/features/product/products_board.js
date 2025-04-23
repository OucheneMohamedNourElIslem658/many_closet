import { RefreshRounded } from "@mui/icons-material";
import { IconButton, Pagination, Skeleton, styled, Table, TableCell, TableHead, TableRow } from "@mui/material";
import { useState } from "react";
import { PromiseBuilder } from "../../commun/components/promise_builder";
import EmptyDataComponent from "../../commun/components/empty";
import { getProducts } from "../../services/product";
import ProductRow from "./components/product_row";

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

const ProductsBoardPage = () => {
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
                        promise={() => getProducts({pageSize, currentPage})}
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
                            const products = data.products;

                            console.log(products);
                            
                            
                            if (!products || products.length === 0) {
                                return <EmptyDataComponent/>
                            }

                            return products.map((product) => {
                                return <ProductRow key={product.$id} product={product} />;
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
 
export default ProductsBoardPage;