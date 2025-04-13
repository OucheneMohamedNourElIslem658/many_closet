import { Pagination, styled } from "@mui/material";

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

const ProductsList = () => {
    const products = [
        {
            picURL: 'https://plus.unsplash.com/premium_photo-1675186049366-64a655f8f537?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2xvdGhpbmd8ZW58MHx8MHx8fDA%3D',
            title: 'Rounded Red Hat',
            price: '50DA',
            colors: [
                {
                    name: 'red',
                    hex: '#FF0000'
                },
                {
                    name: 'blue',
                    hex: '#0000FF'
                }
            ]
        },
        {
            picURL: 'https://images.unsplash.com/photo-1540221652346-e5dd6b50f3e7?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2xvdGhpbmd8ZW58MHx8MHx8fDA%3D',
            title: 'Blue T-Shirt',
            price: '100DA',
            colors: [
                {
                    name: 'blue',
                    hex: '#0000FF'
                },
                {
                    name: 'black',
                    hex: '#000000'
                }
            ]
        },
        {
            picURL: 'https://images.unsplash.com/photo-1540221652346-e5dd6b50f3e7?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2xvdGhpbmd8ZW58MHx8MHx8fDA%3D',
            title: 'Green Sneakers',
            price: '150DA',
            colors: [
                {
                    name: 'green',
                    hex: '#00FF00'
                },
                {
                    name: 'white',
                    hex: '#FFFFFF'
                }
            ]
        },
        {
            picURL: 'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y2xvdGhpbmd8ZW58MHx8MHx8fDA%3D',
            title: 'Black Jacket',
            price: '200DA',
            colors: [
                {
                    name: 'black',
                    hex: '#000000'
                },
                {
                    name: 'grey',
                    hex: '#808080'
                }
            ]
        },
        {
            picURL: 'https://plus.unsplash.com/premium_photo-1675186049222-0b5018db6ce9?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y2xvdGhpbmd8ZW58MHx8MHx8fDA%3D',
            title: 'White Sneakers',
            price: '250DA',
            colors: [
                {
                    name: 'white',
                    hex: '#FFFFFF'
                },
                {
                    name: 'grey',
                    hex: '#808080'
                }
            ]
        },
        {
            picURL: 'https://images.unsplash.com/photo-1509319117193-57bab727e09d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y2xvdGhpbmd8ZW58MHx8MHx8fDA%3D',
            title: 'Purple Dress',
            price: '300DA',
            colors: [
                {
                    name: 'purple',
                    hex: '#800080'
                },
                {
                    name: 'pink',
                    hex: '#FFC0CB'
                }
            ]
        }
    ]

    return ( 
        <div>
            <ContentAlignment>
                {
                    products.map((product, index) => (
                        <Product key={index}>
                            <ProductImage style={{ 
                                backgroundImage: `url(${product.picURL})`, 
                            }}></ProductImage>
                            <h3>{product.title}</h3>
                            <ProductPrice>{product.price}</ProductPrice>
                            <ProductColors>
                                {
                                    product.colors.map((color, index) => (
                                        <li key={index} style={{ backgroundColor: color.hex}}></li>
                                    ))
                                }
                            </ProductColors>
                        </Product>
                    ))
                }
            </ContentAlignment>
            <PaginationController count={10} size="small"/>
        </div>
    );
}
 
export default ProductsList;