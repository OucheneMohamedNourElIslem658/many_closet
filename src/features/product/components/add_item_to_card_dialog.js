import React, { Fragment, useState } from "react";
import ConfirmationDialog from "../../../commun/components/confirmation_dialog";
import { Button, styled } from "@mui/material";
import CustomizedSnackbar from "../../../commun/components/snackbar";

const AddToCartButton = styled(Button)(({ theme }) => ({
    width: '100%',
    padding: '7px 0',
}))

const AddItemToCardDialog = ({onConfirm}) => {
    const [disabled, setDisabled] = useState(false)
    const [open, setOpen] = useState(false)
    let [errorMessage, setMessage] = useState('')

    async function addItemToMyCard() {
        setDisabled(true)
        try {
            await onConfirm()
        } catch (error) {
            setMessage(error.message)
            setOpen(true)
        }
        setDisabled(false)
    }

    return (
        <Fragment>
            <ConfirmationDialog
                button={
                    <AddToCartButton variant="outlined">
                        Add to cart
                    </AddToCartButton>
                }
                title="Add to cart"
                description={`Are you sure you want to add this product to your cart?`}
                areButtonsDisabled={disabled}
                onConfirm={async () => await addItemToMyCard()}
            />
            <CustomizedSnackbar
                open={open}
                message={errorMessage}
                type='error'
                handleClick={() => setOpen(true)}
                handleClose={() => setOpen(false)}
            />
        </Fragment>
    );
}
 
export default AddItemToCardDialog;