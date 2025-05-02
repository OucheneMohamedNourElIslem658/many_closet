import React, { Fragment, useState } from "react";
import ConfirmationDialog from "../../../commun/components/confirmation_dialog";
import CustomizedSnackbar from "../../../commun/components/snackbar";

const ActionConfirmationDialog = ({title, description, triggerButton, onConfirm}) => {
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
            throw error
        }
        setDisabled(false)
    }

    return (
        <Fragment>
            <ConfirmationDialog
                button={triggerButton}
                title={title}
                description={description}
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
 
export default ActionConfirmationDialog;