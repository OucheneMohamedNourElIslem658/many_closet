import { IconButton, Pagination, Skeleton, styled } from "@mui/material";
import { PromiseBuilder } from "../../../commun/components/promise_builder";
import { getProducts } from "../../../services/product";
import SearchField from "../../../commun/components/search_field";
import { FilterListRounded, RefreshRounded } from "@mui/icons-material";
import { useState } from "react";

const ContentAlignment = styled('ul')(({ theme }) => ({
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    justifySelf: 'start',
    width: '100%',
    marginBottom: 40,
    gap: 20,
    [theme.breakpoints.down('md')]: {
        display: 'flex',
        flexWrap: 'wrap'
    },
}))

const Product = styled('li')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'start',
    textAlign: 'center',
    listStyleType: 'none',
    maxWidth: 300,
    [theme.breakpoints.down('md')]: {
        width: 300
    }
}))

const ProductImage = styled('div')(({ theme }) => ({
    width: '100%', 
    height: '400px' ,
    backgroundColor: theme.palette.background.paper,
    backgroundSize: 'contain', 
    backgroundPosition: 'center', 
    marginBottom: 10,
}))

const ProductColors = styled('ul')(({ theme }) => ({
    display: 'flex',
    listStyleType: 'none',
    justifyContent: 'center',
    padding: 0,
    margin: 0,
    gap: 5,
    marginTop: 10,
    marginBottom: 10,
    '& li': {
        width: 20,
        height: 20,
        borderRadius: '50%',
        border: `1px solid ${theme.palette.primary.main}`,
        backgroundClip: 'content-box',
        padding: 3,
    }
}))

const ProductPrice = styled('p')(({ theme }) => ({
    fontFamily: theme.typography.fontFamily,
    color: theme.palette.text.primary,
}))

const PaginationController = styled(Pagination)({
    justifyItems: 'center',
})

const SearchContainer = styled('div')(({ theme }) => ({
    display: 'flex', 
    marginBottom: 20, 
    width: '100%', 
    justifyContent: 'space-between',
}))

const DrawerButton = styled(IconButton)(({ theme }) => ({
    display: 'none',
    color: 'black',
    [theme.breakpoints.down('md')]: {
        display: 'flex',
        justifySelf: 'start',
    }
}))

const ProductsList = ({onDrawerOpen}) => {
    const [refreshKey, setRefreshKey] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [query, setQuery] = useState('');

    const pageSize = 3;

    return (
        <div>
            <SearchContainer>
                <div style={{display: 'flex', gap: 10}}>
                    <SearchField 
                        style={{justifySelf: 'flex-end'}}
                        onValueChanged={(value) => setQuery(value)}
                    />
                    <DrawerButton 
                        variant="outlined"
                        style={{gridColumn: 'span 2'}} 
                        onClick={onDrawerOpen}
                    >
                        <FilterListRounded/>
                    </DrawerButton>
                </div>
                <IconButton onClick={() => setRefreshKey(prev => prev + 1)}>
                    <RefreshRounded style={{color: 'black'}}/>
                </IconButton>
            </SearchContainer>
            <PromiseBuilder
                key={refreshKey}
                promise={() => getProducts({
                    currentPage, 
                    pageSize, 
                    name: query,
                    // tags: [
                    //     '680014cd0037af565569',
                    //     '680014cd0037af565561'
                    // ]
                })}
                loading={
                    <ContentAlignment>
                        {Array.from(new Array(6)).map((_, index) => (
                            <Product key={index}>
                                <Skeleton variant="rectangular" width="100%" height={400} />
                                <Skeleton variant="text" width="70%" height={'40px'} />
                                <Skeleton variant="text" width="40%" height={'30px'}/>
                                <div style={{display: "flex", gap: 5, marginTop: 10}}>
                                    {
                                        Array.from(new Array(3)).map((_, index) => (
                                            <Skeleton key={index} variant="circular" width={40} height={40} />
                                        ))
                                    }
                                </div>
                            </Product>
                        ))}
                    </ContentAlignment>
                }
                builder={(data) => {
                    const products = data.products
                    const maxPages = data.maxPages
                    return <div>
                        <ContentAlignment>
                            {products.map((product, index) => (
                                <Product key={index}>
                                    <ProductImage
                                        style={{
                                            backgroundImage: `url(${product.images[0].url})`,
                                        }}
                                    ></ProductImage>
                                    <h3>{product.name}</h3>
                                    <ProductPrice>{`${product.price}DA`}</ProductPrice>
                                    <ProductColors>
                                        {product.colors.map((color, index) => (
                                            <li
                                                key={index}
                                                style={{ backgroundColor: `#${color.code}` }}
                                            ></li>
                                        ))}
                                    </ProductColors>
                                </Product>
                            ))}
                        </ContentAlignment>
                        <PaginationController
                            count={maxPages} 
                            size="small" 
                            page={currentPage}
                            onChange={(_, value) => {
                                setCurrentPage(value)
                            }}
                        />
                    </div>
                }}
            />
        </div>
    );
}
 
export default ProductsList;