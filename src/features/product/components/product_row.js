import { IconButton, styled, TableCell, TableRow } from "@mui/material";
import ConfirmationDialog from "../../../commun/components/confirmation_dialog";
import { DeleteRounded } from "@mui/icons-material";
// import { useState } from "react";
import theme from "../../../commun/utils/theme";

const ProductInfo = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
    margin: '0 auto',
}))

const ProductRow = ({product}) => {
    // const [_, setOpen] = useState(false);

    return (
        <TableRow key={product.$id}>
            <TableCell onClick={() => {}} sx={{cursor: 'pointer'}}>
                <div style={{display: 'flex', flexDirection: 'row', gap: 0}}>
                    <div style={{
                        backgroundImage: `url(${product.images[0].url})`,
                        height: 230,
                        width: 170,
                        backgroundSize: 'cover',
                        backgroundRepeat: 'repeat',
                    }}>
                    </div>
                    <ProductInfo>
                        <h3>{product.name}</h3>
                        {/* <p>{product.description}</p> */}
                    </ProductInfo>
                </div>
            </TableCell>
            <TableCell>{product.price}DA</TableCell>
            <TableCell>{product.$createdAt}</TableCell>
            {/* <TableCell>{product.status}</TableCell> */}
            <TableCell>
                <ConfirmationDialog
                    title="Delete Order"
                    description="Are you sure you want to delete this order?"
                    button={
                        <IconButton onClick={() => {}} sx={{color: theme.palette.error.main}}>
                            <DeleteRounded/>
                        </IconButton>
                    }
                    onConfirm={() => {}}
                />
            </TableCell>
        </TableRow>

    );
}

export default ProductRow