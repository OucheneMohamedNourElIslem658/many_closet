import { Box, Button, Drawer, IconButton, styled } from "@mui/material";
import FiltersSideBar from "./components/filters_bar";
import ProductsList from "./components/products_list";
import { useState } from "react";
import { FilterListRounded, RefreshRounded } from "@mui/icons-material";
import SearchField from "../../commun/components/search_field";
import { getProducts } from "../../services/product";

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

const DrawerButton = styled(IconButton)(({ theme }) => ({
    display: 'none',
    color: 'black',
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

const Title = styled('h1')(({theme}) => ({
    fontSize: 35,
    fontWeight: 100,
    color: theme.palette.text.primary,
    marginBottom: 8
}))

const SearchContainer = styled('div')(({ theme }) => ({
    display: 'flex', 
    marginBottom: 20, 
    width: '100%', 
    justifyContent: 'space-between',
}))

const ShopPage = () => {
    const [open, setOpen] = useState(false);

    return ( 
        <div>
            <ContentAlignment>
                <Header>
                    <Title>Fashion</Title>
                    <HeaderSubTitle>Welcome to our shop</HeaderSubTitle>
                </Header>
                <FiltersSizeBarContainer>
                    <FiltersSideBar/>
                </FiltersSizeBarContainer>
                <div>
                    <SearchContainer>
                        <div style={{display: 'flex', gap: 10}}>
                            <SearchField style={{justifySelf: 'flex-end'}}/>
                            <DrawerButton 
                                variant="outlined"
                                style={{gridColumn: 'span 2'}} 
                                onClick={() => setOpen(!open)}
                            >
                                <FilterListRounded/>
                            </DrawerButton>
                        </div>
                        <IconButton onClick={async () => {
                            const docs = await getProducts()
                            console.log(docs);
                            
                        }}>
                            <RefreshRounded style={{color: 'black'}}/>
                        </IconButton>
                    </SearchContainer>
                    <ProductsList/>
                </div>
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