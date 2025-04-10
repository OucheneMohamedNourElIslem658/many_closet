import { styled } from "@mui/material";
import FiltersSideBar from "./components/filters_bar";
import ProductsList from "./components/products_list";

const ContentAlignment = styled('div')(({ theme }) => ({
    display: 'grid',
    gridTemplateColumns: '3fr 7fr',
    maxWidth: 1200,
    margin: '40px auto',
    padding: '0 20px',
    justifyContent: 'end',
    columnGap: 40,
    [theme.breakpoints.down('md')]: {
        gridTemplateColumns: '1fr',
    }
}))

const Header = styled('div')({
    gridColumn: 'span 2',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    gap: 5
})

const HeaderSubTitle = styled('p')(({ theme }) => ({
    fontFamily: theme.typography.fontFamily,
    color: theme.palette.text.secondary,
    marginBottom: 10,
}))


const ShopPage = () => {
    return ( 
        <ContentAlignment>
            <Header>
                <h1>Fashion</h1>
                <HeaderSubTitle>Welcome to our shop</HeaderSubTitle>
            </Header>
            <FiltersSideBar/>
            <ProductsList/>
        </ContentAlignment>
    );
}
 
export default ShopPage;