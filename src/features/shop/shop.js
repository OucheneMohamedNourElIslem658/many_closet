import { Box, Drawer, styled } from "@mui/material";
import FiltersSideBar from "./components/filters_bar";
import ProductsList from "./components/products_list";
import { useState } from "react";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet";

const ContentAlignment = styled('div')(({ theme }) => ({
    display: 'grid',
    gridTemplateColumns: '1fr 3fr',
    maxWidth: 1200,
    margin: '40px auto',
    padding: '0 20px',
    justifyContent: 'end',
    columnGap: 40,
    gap: 20,
    [theme.breakpoints.down('md')]: {
        gridTemplateColumns: '1fr',
    }
}))

const Header = styled('div')(({ theme }) => ({
    gridColumn: 'span 2',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    [theme.breakpoints.down('md')]: {
        gridColumn: 'span 1',
    }
}))

const HeaderSubTitle = styled('p')(({ theme }) => ({
    fontFamily: theme.typography.fontFamily,
    color: theme.palette.text.secondary,
    marginBottom: 10,
}))

const CustomDrawer = styled(Drawer)(({ theme }) => ({
    [theme.breakpoints.down('md')]: {
        display: 'block',
    }
}))

const FiltersSizeBarContainer = styled('div')(({ theme }) => ({
    [theme.breakpoints.down('md')]: {
        display: 'none',
    },
}))

const Title = styled('h1')(({theme}) => ({
    fontSize: 35,
    fontWeight: 100,
    color: theme.palette.text.primary,
    marginBottom: 8
}))

const ShopPage = () => {
    const [open, setOpen] = useState(false);
    const [filters, setFilters] = useState({
        tags: [],
        colors: [],
        sizes: [],
        price: {}
    });

    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        const tags = searchParams.get("tags")?.split(",") || [];
        const colors = searchParams.get("colors")?.split(",") || [];
        const sizes = searchParams.get("sizes")?.split(",") || [];
        const price = searchParams.get("price") ? JSON.parse(searchParams.get("price")) : {};
        const query = searchParams.get("query") || "";
        const page = searchParams.get("page") || 1;
        if (price.max === null) {
            price.max = Infinity;
        }
        setFilters({ tags, colors, sizes, price, query, page });
    }, [searchParams]);

    const updateUrlFilters = (updatedFilters) => {
        const params = {};
        if (updatedFilters.tags.length) params.tags = updatedFilters.tags.join(",");
        if (updatedFilters.colors.length) params.colors = updatedFilters.colors.join(",");
        if (updatedFilters.sizes.length) params.sizes = updatedFilters.sizes.join(",");
        if (Object.keys(updatedFilters.price).length) params.price = JSON.stringify(updatedFilters.price);
        if (updatedFilters.query) params.query = updatedFilters.query;
        if (updatedFilters.page) params.page = updatedFilters.page;
        setSearchParams(params);
    };

    const handleFilterChange = (key, value) => {
        let selectedValues;
        switch (key) {
            case "price":
                selectedValues = value || {};
                break;
            case "query":
                selectedValues = value || "";
                break;
            case "page":
                selectedValues = value || 1;
                break;
            default:
                selectedValues = value.map((item) => item.name);
                break;
        }

        const updatedFilters = { ...filters, [key]: selectedValues };
        setFilters(updatedFilters);
        updateUrlFilters(updatedFilters);
    };

    return ( 
        <div>
            <Helmet>
                <title>Shop</title>
                <meta name="description" content="Welcome to our online store!" />
                <meta name="keywords" content="store, online, shopping, many closet" />
            </Helmet>
            <ContentAlignment>
                <Header>
                    <Title>Fashion</Title>
                    <HeaderSubTitle>Welcome to our shop</HeaderSubTitle>
                </Header>
                <FiltersSizeBarContainer>
                    <FiltersSideBar
                        initialFilters={filters}
                        onCategoryChanged={(data) => handleFilterChange("tags", data)}
                        onColorChanged={(data) => handleFilterChange("colors", data)}
                        onSizeChanged={(data) => handleFilterChange("sizes", data)}
                        onPriceChanged={(data) => handleFilterChange("price", data)}
                    />
                </FiltersSizeBarContainer>
                <ProductsList 
                    onDrawerOpen={() => setOpen(!open)} 
                    filters={filters}
                    onSearchQueryChanged={(query) => handleFilterChange("query", query)}
                    onPageChanged={(page) => handleFilterChange("page", page)}
                />
            </ContentAlignment>
            <CustomDrawer
                anchor='left'
                open={open}
                onClose={() => setOpen(false)}
            >
                <Box sx={{width: 250}} padding={'20px'} role="presentation">
                    <FiltersSideBar
                        initalFilters={filters}
                        onCategoryChanged={(data) => handleFilterChange("tags", data)}
                        onColorChanged={(data) => handleFilterChange("colors", data)}
                        onSizeChanged={(data) => handleFilterChange("sizes", data)}
                        onPriceChanged={(data) => handleFilterChange("price", data)}
                    />
                </Box>
            </CustomDrawer>
        </div>
    );
};
 
export default ShopPage;