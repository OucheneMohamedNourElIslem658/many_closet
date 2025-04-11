import { AddRounded, RemoveRounded, ShoppingBagOutlined, StarBorderRounded } from "@mui/icons-material";
import { Button, IconButton, styled } from "@mui/material";
import Selector from "../../commun/components/option_selector";

const Picture = styled('div')(({ theme }) => ({
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    width: '58px',
    height: '77px',
    marginBottom: '20px',
    border: `1px solid ${theme.palette.primary.main}`,
    backgroundClip: 'content-box',
    padding: '10px',
}))

const MainPicture = styled('div')(({ theme }) => ({
    height: '650px',
    width: '490px',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
}))

const Name = styled('h1')(({ theme }) => ({
    fontSize: '30px',
    fontWeight: '100',
    marginBottom: '10px',
    color: theme.palette.primary.main,
}))

const AvailablityTag = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.error.main,
    color: '#fff',
    padding: '2px 10px',
    borderRadius: '20px',
    fontSize: '11px',
    fontFamily: theme.typography.fontFamily,
    justifySelf: 'start',
}))

const Price = styled('p')(({ theme }) => ({
    fontSize: '24px',
    fontWeight: '100',
    marginBottom: '10px',
    color: theme.palette.primary.main,
}))

const Description = styled('p')(({ theme }) => ({
    fontSize: '16px',
    fontWeight: '100',
    marginBottom: '10px',
    color: theme.palette.secondary.main,
    fontFamily: theme.typography.fontFamily,
}))

const OrdersContainer = styled('p')(({ theme }) => ({
    fontSize: '14px',
    fontWeight: '100',
    marginBottom: '10px',
    color: theme.palette.secondary.main,
    fontFamily: theme.typography.fontFamily,
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
}))

const TagsList = styled('ul')(({theme}) => ({
    display: 'flex',
    whiteSpace: 'wrap',
    listStyleType: 'none',
    padding: '0',
    margin: '0',
    gap: '10px',
    fontFamily: theme.typography.fontFamily,
    color: theme.palette.secondary.main,
    fontSize: '14px',
    marginTop: '10px',
    marginBottom: '20px',
}))

const QuantityController = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    border: `1px solid ${theme.palette.grey[300]}`,
    justifySelf: 'start',
    borderRadius: '5px',
    fontFamily: theme.typography.fontFamily,
    marginTop: '10px',
}))

const QuantityDecButton = styled(IconButton)(({ theme }) => ({
    borderRadius: 0,
    borderTopLeftRadius: '5px',
    borderBottomLeftRadius: '5px',
    color: theme.palette.primary.main,
}))

const QuantityIncButton = styled(IconButton)(({ theme }) => ({
    borderRadius: 0,
    borderTopRightRadius: '5px',
    borderBottomRightRadius: '5px',
    color: theme.palette.primary.main,
}))

const AddToCartButton = styled(Button)(({ theme }) => ({
    width: '100%',
    padding: '7px 0',
}))

const PicturesAlignment = styled('div')(({ theme }) => ({
    display: 'flex',
    gap: '20px',
}))

const ProductPageContainer = styled('div')(({ theme }) => ({
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
}))

const InfoContainer = styled('div')(({ theme }) => ({
    justifySelf: 'start',
    display: 'flex',
    flexDirection: 'column',
}))

const SidePicturesList = styled('ul')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    listStyleType: 'none',
}))

const TitleContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    width: '100%',
}))

const Spacer = styled('div')(({ theme }) => ({
    flexGrow: 1,
}))

const QuantityContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'end',
    gap: '30px',
}))

const FavButton = styled(IconButton)(({ theme }) => ({
    border: `1px solid ${theme.palette.grey[300]}`,
    padding: 4,
}))

const ProductPage = () => {
    const product = {
        picsURLs: [
            'https://plus.unsplash.com/premium_photo-1675186049366-64a655f8f537?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2xvdGhpbmd8ZW58MHx8MHx8fDA%3D',
            'https://images.unsplash.com/photo-1540221652346-e5dd6b50f3e7?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2xvdGhpbmd8ZW58MHx8MHx8fDA%3D',
            'https://images.unsplash.com/photo-1540221652346-e5dd6b50f3e7?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2xvdGhpbmd8ZW58MHx8MHx8fDA%3D',
            'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y2xvdGhpbmd8ZW58MHx8MHx8fDA%3D',
            'https://plus.unsplash.com/premium_photo-1675186049222-0b5018db6ce9?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y2xvdGhpbmd8ZW58MHx8MHx8fDA%3D',
            'https://images.unsplash.com/photo-1509319117193-57bab727e09d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y2xvdGhpbmd8ZW58MHx8MHx8fDA%3D',
        ],
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
        ],
        description: 'This is a black jacket made of high quality materials. It is perfect for winter and will keep you warm and stylish. It is available in different sizes and colors. It is a must-have for your wardrobe.',
        ordersCount: 100,
        sizes: ['L', 'M', 'S', 'XL'],
        tags: ['jacket', 'clothing', 'fashion'],
        orderedQuantity: 3,
        isAvailable: false,
        isFavourite: false,
    }

    return ( 
        <ProductPageContainer>
            <PicturesAlignment>
                <SidePicturesList>
                    {
                        product.picsURLs.map((picURL, index) => (
                            <li key={index}>
                                <Picture style={{backgroundImage: `url(${picURL})`}}></Picture>
                            </li>
                        ))
                    }
                </SidePicturesList>
                <MainPicture style={{backgroundImage: `url(${product.picsURLs[0]})`}}></MainPicture>
            </PicturesAlignment>
            <InfoContainer>
                <TitleContainer>
                    <Name>{product.title}</Name>
                    <AvailablityTag>{product.isAvailable ? 'AVAILABLE' : 'NOT AVAILABLE'}</AvailablityTag>
                    <Spacer/>
                    <Price>{product.price}</Price>
                </TitleContainer>
                <Description>{product.description}</Description>
                <OrdersContainer>
                    <ShoppingBagOutlined style={{color: 'black'}}/>
                    <p>{product.ordersCount} 24 people ordered this product</p>
                    <Spacer/>
                    <FavButton><StarBorderRounded style={{height: 20, width: 20}}/></FavButton>
                </OrdersContainer>
                <Selector title="Size" options={product.sizes}/>
                <Selector 
                    title="Colors" 
                    options={product.colors.map(color => color.name)} 
                    isColor={true}
                    intialSelection={product.colors[0]}
                />
                <div>
                    <p>Tags</p>
                    <TagsList>
                        {
                            product.tags.map((tag, index) => (
                                <li key={index}>
                                    <p>{tag}</p>
                                </li>
                            ))
                        }
                    </TagsList>
                </div>
                <QuantityContainer>
                    <div>
                        <p>Quantity</p>
                        <QuantityController>
                            <QuantityDecButton>
                                <RemoveRounded/>
                            </QuantityDecButton>
                            <p>{product.orderedQuantity}</p>
                            <QuantityIncButton>
                                <AddRounded/>
                            </QuantityIncButton>
                        </QuantityController>
                    </div>
                    <AddToCartButton variant="outlined">Add to cart</AddToCartButton>
                </QuantityContainer>
            </InfoContainer>
        </ProductPageContainer>
    );
}
 
export default ProductPage;