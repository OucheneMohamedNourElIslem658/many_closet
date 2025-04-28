import { AddRounded, RefreshRounded } from "@mui/icons-material";
import { Fab, IconButton, Pagination, styled, Table, TableCell, TableHead, TableRow } from "@mui/material";
import { useState } from "react";
import { PromiseBuilder } from "../../commun/components/promise_builder";
import EmptyDataComponent from "../../commun/components/empty";
import { getProducts } from "../../services/product";
import ProductRow from "./components/product_row";
import SearchField from "../../commun/components/search_field";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

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

const ControlContainer = styled('div')({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
})

const ProductsBoardPage = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10

    const [search, setSearch] = useState('');

    const [refreshKey, setRefreshKey] = useState(0);

    return (
        <ContentContainer>
            <div>
                <Title>Products Board</Title>
                <SubTitle>Here you can adjust your products</SubTitle>
            </div>
            <ControlContainer>
                <SearchField
                    onValueChanged={(value) => {
                        setCurrentPage(1);
                        setSearch(value);
                    }}
                />
                <RefreshButton onClick={async () => setRefreshKey(refreshKey + 1)}>
                    <RefreshRounded/>
                </RefreshButton>
            </ControlContainer>
            <TableScroller>
                <OrdersTable>
                    <TableHeader>
                        <TableRow>
                            <TableHeaderTitles>Product</TableHeaderTitles>
                            <TableHeaderTitles>Price</TableHeaderTitles>
                            <TableHeaderTitles>Time</TableHeaderTitles>
                            <TableHeaderTitles></TableHeaderTitles>
                            <TableCell/>
                        </TableRow>
                    </TableHeader>
                    <PromiseBuilder
                        promise={() => getProducts({pageSize, currentPage, isAdminBoard: true, name: search})}
                        loading={
                            Array.from({ length: pageSize }).map((_, index) => (
                                <ProductRow isLoading={true} key={index}/>
                            ))
                        }
                        builder={(data) => {
                            const products = data.products;
                            
                            
                            if (!products || products.length === 0) {
                                return <EmptyDataComponent/>
                            }

                            return products.map((product) => {
                                return <ProductRow key={product.$id} product={product} onItemDeleted={() => setRefreshKey(refreshKey + 1)} />;
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
            <Link to={'/admin/products/create'} style={{
                position: 'sticky',
                bottom: 20,
                right: 20,
                alignSelf: 'end',
            }}>
                <Fab 
                    color="primary" 
                    aria-label="add"
                >
                    <AddRounded/>
                </Fab>
            </Link>
        </ContentContainer>
    );
}
 
export default ProductsBoardPage;