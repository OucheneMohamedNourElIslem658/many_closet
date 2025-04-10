import { styled } from "@mui/material";

const ContentAlignment = styled('ul')(({ theme }) => ({
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    padding: '0 20px',
    justifySelf: 'start',
    [theme.breakpoints.down('md')]: {
        gridTemplateColumns: '1fr',
    },
}))

const Product = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: 10,
    margin: 10,
    backgroundColor: theme.palette.background.paper,
    backgroundSize: 'contain', 
    backgroundPosition: 'center', 
    width: '200px', 
    height: '200px' ,
}))

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
        <ContentAlignment>
            {
                products.map((product, index) => (
                    <li key={index}>
                        <Product style={{ 
                            backgroundImage: `url(${product.picURL})`, 
                        }}></Product>
                        <h2>{product.title}</h2>
                        <p>{product.price}</p>
                        <ul>
                            {
                                product.colors.map((color, index) => (
                                    <li key={index} style={{ backgroundColor: color.hex, width: '20px', height: '20px' }}></li>
                                ))
                            }
                        </ul>
                    </li>
                ))
            }
        </ContentAlignment>
    );
}
 
export default ProductsList;