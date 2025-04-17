import { Box, Drawer, styled } from "@mui/material";
import FiltersSideBar from "./components/filters_bar";
import ProductsList from "./components/products_list";
import { useState } from "react";

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

    return ( 
        <div>
            <ContentAlignment>
                <Header>
                    <Title>Fashion</Title>
                    <HeaderSubTitle>Welcome to our shop</HeaderSubTitle>
                </Header>
                <FiltersSizeBarContainer>
                <FiltersSideBar
                    onCategoryChanged={(data) => setFilters({...filters, tags: data})}
                    onColorChanged={(data) => setFilters({...filters, colors: data})}
                    onSizeChanged={(data) => setFilters({...filters, sizes: data})}
                    onPriceChanged={(data) => setFilters({...filters, price: data})}
                />
                </FiltersSizeBarContainer>
                <ProductsList onDrawerOpen={() => setOpen(!open)} filters={filters}/>
            </ContentAlignment>
            <CustomDrawer
                anchor='left'
                open={open}
                onClose={() => setOpen(false)}
            >
                <Box sx={{width: 250}} padding={'20px'} role="presentation">
                <FiltersSideBar
                    onCategoryChanged={(data) => setFilters({...filters, categories: data})}
                    onColorChanged={(data) => setFilters({...filters, colors: data})}
                    onSizeChanged={(data) => setFilters({...filters, sizes: data})}
                    onPriceChanged={(data) => setFilters({...filters, price: data})}
                />
                </Box>
            </CustomDrawer>
        </div>
    );
}
 
export default ShopPage;