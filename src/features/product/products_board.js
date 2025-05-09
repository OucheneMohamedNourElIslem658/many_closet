import { AddRounded, RefreshRounded } from "@mui/icons-material";
import { Fab, IconButton, Pagination, styled, Table, TableCell, TableHead, TableRow } from "@mui/material";
import { useEffect, useState } from "react";
import { PromiseBuilder } from "../../commun/components/promise_builder";
import EmptyDataComponent from "../../commun/components/empty";
import { getProducts } from "../../services/product";
import ProductRow from "./components/product_row";
import SearchField from "../../commun/components/search_field";
import { Link, useSearchParams } from "react-router-dom";
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

const ControlContainer = styled('div')({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
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

const ProductsBoardPage = () => {
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
        setFilters({ query, page });
    }, [searchParams]);

    const updateUrlFilters = (updatedFilters) => {
        const params = {};
        if (updatedFilters.query) params.query = updatedFilters.query;
        if (updatedFilters.page) params.page = updatedFilters.page;
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
                <title>My Products</title>
                <meta name="description" content="Manage and adjust your products on the Products Board." />
                <meta name="keywords" content="products, management, admin, board" />
                <meta name="author" content="Your Company Name" />
            </Helmet>
            <div>
                <Title>Products Board</Title>
                <SubTitle>Here you can adjust your products</SubTitle>
            </div>
            <ControlContainer>
                <SearchField
                    defaultValue={filters.query}
                    onValueChanged={(value) => {
                        handleFilterChange('page', 1);
                        handleFilterChange('query', value);
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
                        promise={() => getProducts({
                            pageSize, 
                            currentPage: filters.page, 
                            isAdminBoard: true, 
                            name: filters.query
                        })}
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
                                return <ProductRow key={product.$id} product={product} />;
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
            <AddProductButton to={'/admin/products/create'}>
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
 
export default ProductsBoardPage;