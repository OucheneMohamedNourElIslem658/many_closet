import { IconButton, styled, TableCell, TableRow } from "@mui/material";
import ConfirmationDialog from "../../../commun/components/confirmation_dialog";
import { DeleteRounded, EditRounded } from "@mui/icons-material";
// import { useState } from "react";
import theme from "../../../commun/utils/theme";
import { deleteOrder } from "../../../services/product";

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
    WebkitLineClamp: 2,
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
}))

const Colors = styled('ul')(({ theme }) => ({
    listStyleType: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,

    '& li': {
        width: 20, 
        height: 20, 
        borderRadius: '50%',
        border: `solid 0.1px ${theme.palette.text.secondary}`,
    }
}))

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

const ProductRow = ({product, onItemDeleted}) => {
    return (
        <TableRow key={product.$id}>
            <TableCell onClick={() => {}} sx={{cursor: 'pointer'}}>
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
                        <h2 style={{fontFamily: 'Volkhov'}}>{product.name}</h2>
                        <Desc>{product.desc}</Desc>
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
                                <li key={index} style={{backgroundColor: `#${color.code}`}}></li>
                            ))}
                        </Colors>
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
                <ConfirmationDialog
                    title="Delete Product"
                    description="Are you sure you want to delete this product?"
                    button={
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
        </TableRow>

    );
}

export default ProductRow