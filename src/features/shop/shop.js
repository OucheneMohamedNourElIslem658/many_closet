import { Box, Button, Drawer, styled } from "@mui/material";
import FiltersSideBar from "./components/filters_bar";
import ProductsList from "./components/products_list";
import { useState } from "react";
import { FilterListRounded } from "@mui/icons-material";

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

const DrawerButton = styled(Button)(({ theme }) => ({
    display: 'none',
    [theme.breakpoints.down('md')]: {
        display: 'flex',
        justifySelf: 'start',
    }
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

const ShopPage = () => {
    const [open, setOpen] = useState(false);

    return ( 
        <div>
            <ContentAlignment>
            <Header>
                <h1>Fashion</h1>
                <HeaderSubTitle>Welcome to our shop</HeaderSubTitle>
            </Header>
            <FiltersSizeBarContainer>
                <FiltersSideBar/>
            </FiltersSizeBarContainer>
            <DrawerButton 
                variant="outlined"
                style={{gridColumn: 'span 2'}} 
                onClick={() => setOpen(!open)}
                startIcon={<FilterListRounded/>}
            >
                Filters
            </DrawerButton>

            <ProductsList/>
        </ContentAlignment>
            <CustomDrawer
                anchor='left'
                open={open}
                onClose={() => setOpen(false)}
            >
                <Box sx={{width: 250}} padding={'20px'} role="presentation">
                    <FiltersSideBar/>
                </Box>
            </CustomDrawer>
        </div>
    );
}
 
export default ShopPage;