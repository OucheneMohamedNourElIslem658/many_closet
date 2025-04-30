import { IconButton, Skeleton, styled, TableCell, TableRow } from "@mui/material";
import { DeleteRounded, EditRounded } from "@mui/icons-material";
import theme from "../../../commun/utils/theme";
import { deleteOrder } from "../../../services/product";
import ActionConfirmationDialog from "../../landing/components/action_confirmation_dialog";

const ProductInfo = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
    gap: 5,
}))

const Desc = styled('p')(({ theme }) => ({
    fontSize: 14,
    color: theme.palette.text.secondary,
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 3,
    textOverflow: 'ellipsis',
    marginBottom: 0,
    overflow: 'hidden',
    maxWidth: 400,
}))

const Leading = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'start',
    gap: 15,
}))

const Categories = styled('ul')(({ theme }) => ({
    listStyleType: 'none',
    padding: 0,
    margin: 0,
    fontSize: 13,
    color: theme.palette.secondary.main,
    display: 'flex',
    flexDirection: 'row',
    gap: 7,
    whiteSpace: 'nowrap',
    '& li::before': {
        content: '"• "',
    }
}))

const Sizes = styled('ul')(({ theme }) => ({
    listStyleType: 'none',
    padding: 0,
    margin: 0,
    fontSize: 13,
    color: theme.palette.secondary.main,
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    whiteSpace: 'nowrap',
    '& li::before': {
        content: '"• "',
    }
}))

const Colors = styled('ul')(({ theme }) => ({
    listStyleType: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
    fontSize: 13,
    color: theme.palette.secondary.main,
    whiteSpace: 'nowrap',
    '& li::before': {
        content: '"• "',
    }
}))

const Name = styled('h2')({
    fontWeight: 100,
    fontFamily: 'Volkhov'
})

const AvailablityTag = styled('span')(({ theme }) => ({
    fontSize: 12,
    color: theme.palette.error.main,
    gap: 10,
    border: `solid 1px ${theme.palette.error.main}`,
    padding: '3px 7px',
    borderRadius: 20,

    '&.available': {
        color: theme.palette.success.main,
        border: `solid 1px ${theme.palette.success.main}`,
    },
}))

const ProductRow = ({product, onItemDeleted, isLoading}) => {
    if (isLoading) {
        return (
            <TableRow>
            <TableCell>
                <Leading>
                <div style={{
                    height: 230,
                    width: 170,
                    minWidth: 170,
                    backgroundColor: theme.palette.action.hover,
                }}>
                    <Skeleton variant="rectangular" height={230} width={170} />
                </div>
                <ProductInfo>
                    <Skeleton variant="text" width={150} />
                    <div>
                        <Skeleton variant="text" width={300} />
                        <Skeleton variant="text" width={300} />
                        <Skeleton variant="text" width={300} />
                    </div>
                    <div>
                    <Categories sx={{ '& li::before': { content: 'none' } }}>
                        {[...Array(3)].map((_, index) => (
                        <li key={index}>
                            <Skeleton variant="text" width={50} />
                        </li>
                        ))}
                    </Categories>
                    <Sizes sx={{ '& li::before': { content: 'none' } }}>
                        {[...Array(3)].map((_, index) => (
                        <li key={index}>
                            <Skeleton variant="text" width={30} />
                        </li>
                        ))}
                    </Sizes>
                    <Colors sx={{ '& li::before': { content: 'none' } }}>
                        {[...Array(3)].map((_, index) => (
                        <li key={index}>
                            <Skeleton variant="text" width={40} />
                        </li>
                        ))}
                    </Colors>
                    </div>
                    <Skeleton variant="rectangular" width={100} height={20} />
                </ProductInfo>
                </Leading>
            </TableCell>
            <TableCell>
                <Skeleton variant="text" width={50} />
            </TableCell>
            <TableCell>
                <Skeleton variant="text" width={100} />
            </TableCell>
            </TableRow>
        )
    } else {
        return (<TableRow key={product.$id}>
            <TableCell>
                <Leading>
                    <div style={{
                        backgroundImage: `url(${product.images[0].url})`,
                        height: 230,
                        width: 170,
                        minWidth: 170,
                        backgroundSize: 'cover',
                        backgroundRepeat: 'repeat',
                    }}>
                    </div>
                    <ProductInfo>
                        <Name>{product.name}</Name>
                        <Desc>{product.desc}</Desc>
                        <div>
                            <Categories>
                                {product.categories.map((category, index) => (
                                    <li key={index}>{category.name}</li>
                                ))}
                            </Categories>
                            <Sizes>
                                {product.sizes.map((size, index) => (
                                    <li key={index}>{size.name}</li>
                                ))}
                            </Sizes>
                            <Colors>
                                {product.colors.map((color, index) => (
                                    <li key={index} >{color.name}</li>
                                ))}
                            </Colors>
                        </div>
                        {
                            product.is_available ?
                                <AvailablityTag className="available">Available</AvailablityTag> : 
                                <AvailablityTag>Unavailable</AvailablityTag>
                        }
                    </ProductInfo>
                </Leading>
            </TableCell>
            <TableCell>{product.price}DA</TableCell>
            <TableCell style={{whiteSpace: 'nowrap'}}>{product.timeAgo}</TableCell>
            <TableCell>
                <IconButton sx={{color: theme.palette.primary.main}}>
                    <EditRounded/>
                </IconButton>
                <ActionConfirmationDialog
                    title="Delete Product"
                    description="Are you sure you want to delete this product?"
                    triggerButton={
                        <IconButton sx={{color: theme.palette.error.main}}>
                            <DeleteRounded/>
                        </IconButton>
                    }
                    onConfirm={
                        async () => {
                            await deleteOrder(product.$id)
                            onItemDeleted()
                        }
                    }
                />
            </TableCell>
        </TableRow>)
    }
}

export default ProductRow