import { AddRounded, RemoveRounded, ShoppingBagOutlined } from "@mui/icons-material";
import { Box, Button, IconButton, Skeleton, styled } from "@mui/material";
import Selector from "../../commun/components/option_selector";
import { useState } from "react";
import OrdersDrawer from "../orders/components/order_drawer";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { PromiseBuilder } from "../../commun/components/promise_builder";
import { getProduct } from "../../services/product";
import { addItemToCard } from "../../services/order";
import AddItemToCardDialog from "../landing/components/action_confirmation_dialog";

const Picture = styled('div')(({ theme }) => ({
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    width: '58px',
    height: '77px',
    marginBottom: '20px',
    backgroundClip: 'content-box',
    padding: '10px',
    border: `1px solid transparent`,
    '&.selected': {
        border: `1px solid ${theme.palette.primary.main}`,
    },
}))

const MainPicture = styled('div')(({ theme }) => ({
    height: '650px',
    flexGrow: 1,
    overflow: 'hidden',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    [theme.breakpoints.down('md')]: {
        height: 430,
        width: 350,
    }
}))

const Name = styled('h1')(({ theme }) => ({
    fontSize: '30px',
    fontWeight: '100',
    marginBottom: '10px',
    color: theme.palette.primary.main,
    whiteSpace: 'nowrap'
}))

const AvailablityTag = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.error.main,
    color: '#fff',
    padding: '2px 10px',
    borderRadius: '20px',
    fontSize: '11px',
    fontFamily: theme.typography.fontFamily,
    justifySelf: 'start',
    whiteSpace: 'nowrap',
    position: 'relative',
    bottom: 5,
    '&.available': {
        backgroundColor: theme.palette.success.main,
    },
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
    marginBottom: '20px',
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
    [theme.breakpoints.down('md')]: {
        flexDirection: 'column-reverse',
        justifySelf: 'start',
        marginBottom: '10px',
    }
}))

const ProductPageContainer = styled('div')(({ theme }) => ({
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '50px',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    marginBottom: '50px',
    [theme.breakpoints.down('md')]: {
        gridTemplateColumns: '1fr',
        margin: '0 20px',
        marginBottom: '50px',
        maxWidth: '500px',
        gap: '10px',
        justifySelf: 'center',
    },
}))

const InfoContainer = styled('div')(({ theme }) => ({
    justifySelf: 'start',
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '500px',
}))

const SidePicturesList = styled('ul')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    listStyleType: 'none',
    overflow: 'scroll',
    height: 670,
    scrollbarWidth: 'none',
    maxWidth: 430,
    '&::-webkit-scrollbar': {
        display: 'none',
    },
    [theme.breakpoints.down('md')]: {
        flexDirection: 'row',
        gap: 15,
        height: 'auto',
    }
}))

const TitleContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    gap: 10
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
    const [open, setOpen] = useState(false);

    const { id } = useParams();

    return ( 
        <PromiseBuilder
            promise={() => getProduct(id)}
            loading={<ProductPageLoader/>}
            builder={(product) => {
                const colors = product.colors.map((color) => ({
                    id: color.$id,
                    name: color.name,
                    hex: color.code,
                }))

                const sizes = product.sizes.map((size) => ({
                    id: size.$id,
                    name: size.name,
                }))

                let sizeID = sizes[0].id
                let colorID = colors[0].id
                let quantity = 1

                return <ProductPageContainer>
                <ProductPicture images={product.images}/>
                <InfoContainer>
                    <TitleContainer>
                        <Name>{product.name}</Name>
                        <AvailablityTag
                            className={product.is_available ? 'available' : 'not-available'}
                        >
                            {product.is_available ? 'AVAILABLE' : 'NOT AVAILABLE'}
                        </AvailablityTag>
                        <Spacer/>
                        <Price>{product.price}DA</Price>
                    </TitleContainer>
                    <Description>{product.desc}</Description>
                    <OrdersContainer>
                        <ShoppingBagOutlined style={{color: 'black', position: 'relative', bottom: 2}}/>
                        <p>{product.totalOrders} people ordered this product</p>
                    </OrdersContainer>
                    <Selector 
                        title="Size" 
                        options={sizes}
                        type="single"
                        initialOption={sizes[0]}
                        onOptionSelected={(selected) => sizeID = selected[0]}
                    />
                    <Selector 
                        title="Colors" 
                        options={colors} 
                        isColor={true}
                        type="single"
                        initialOption={colors[0]}
                        onOptionSelected={(selected) => colorID = selected[0]}
                    />
                    <div>
                        <p>Tags</p>
                        <TagsList>
                            {
                                product.categories.map((tag, index) => (
                                    <li key={index}>
                                        <p>{tag.name}</p>
                                    </li>
                                ))
                            }
                        </TagsList>
                    </div>
                    <QuantityContainer>
                        <QuantityCounter 
                            onChanged={(value) => quantity = (value || 1)}
                        />
                        <AddItemToCardDialog
                            title={"Add to cart"}
                            description={`Are you sure you want to add ${product.name} to your cart?`}
                            triggerButton={
                                <AddToCartButton variant="outlined">
                                    Add to cart
                                </AddToCartButton>
                            }
                            onConfirm={async () => await addItemToCard({productID: product.$id, sizeID, colorID, quantity})}
                        />
                    </QuantityContainer>
                </InfoContainer>
                <OrdersDrawer
                    open={open} 
                    onClose={() => setOpen(false)} 
                />
            </ProductPageContainer>
            }}
        />
    );
}

const QuantityCounter = ({initialValue, onChanged = () => {}}) => {
    const [counter, setCounter] = useState(initialValue || 1); 

    function incCounter() {
        if (counter < 10) {
            setCounter(counter + 1);
            onChanged(counter + 1);
        }
    }

    function decCounter() {
        if (counter > 0) {
            setCounter(counter - 1);
            onChanged(counter - 1);
        }
    }

    return (
        <div>
            <p>Quantity</p>
            <QuantityController>
                <QuantityDecButton onClick={decCounter}>
                    <RemoveRounded/>
                </QuantityDecButton>
                <Box 
                    width={20} 
                    display="flex" 
                    justifyContent="center" 
                    alignItems="center"
                >
                    {counter}
                </Box>
                <QuantityIncButton onClick={incCounter}>
                    <AddRounded/>
                </QuantityIncButton>
            </QuantityController>
        </div>
    );
}

const ProductPageLoader = () => {
    return <ProductPageContainer>
        <PicturesAlignment>
            <SidePicturesList style={{gap: '10px'}}>
                {Array(5).fill(0).map((_, index) => (
                    <li key={index}>
                        <Skeleton variant="rectangular" width={58} height={77} />
                    </li>
                ))}
            </SidePicturesList>
            <Skeleton variant="rectangular" width="100%" height={650} />
        </PicturesAlignment>
        <InfoContainer>
            <TitleContainer style={{gap: 10}}>
                <Skeleton variant="text" width="40%" height={40} />
                <Skeleton variant="rectangular" width={100} height={20} style={{ borderRadius: '20px' }} />
                <Spacer />
                <Skeleton variant="text" width={80} height={30} />
            </TitleContainer>
            <Skeleton variant="text" width="100%" height={60} />
            <OrdersContainer>
                <ShoppingBagOutlined style={{ color: '#e0e0e0', position: 'relative', bottom: 2 }} />
                <Skeleton variant="text" width={150} height={20} />
            </OrdersContainer>
            <Selector title="Size" isLoading={true} />
            <Selector title="Colors" isColor={true} isLoading={true} />
            <Selector title="Tags" isLoading={true} />
            <QuantityContainer>
                <div>
                    <Skeleton width={80}/>
                    <QuantityController>
                        <QuantityDecButton disabled>
                            <RemoveRounded />
                        </QuantityDecButton>
                        <Skeleton variant="rectangular" width={40} height={30} />
                        <QuantityIncButton disabled>
                            <AddRounded />
                        </QuantityIncButton>
                    </QuantityController>
                </div>
                <Skeleton variant="rectangular" width="100%" height={40} />
            </QuantityContainer>
        </InfoContainer>
    </ProductPageContainer>
}

const ProductPicture  = ({images}) => {
    const [selectedImage, setSelectedImage] = useState(images[0].url);

    return <PicturesAlignment>
        <SidePicturesList>
            {images.map((image, index) => (
                <li key={index} onClick={() => setSelectedImage(image.url)}>
                    <Picture
                        style={{ backgroundImage: `url(${image.url})` }}
                        className={selectedImage === image.url ? 'selected' : ''}>
                    </Picture>
                </li>
            ))}
        </SidePicturesList>
        <MainPicture
            style={{ backgroundImage: `url(${selectedImage})` }}
        ></MainPicture>
    </PicturesAlignment>
}
 
export default ProductPage;