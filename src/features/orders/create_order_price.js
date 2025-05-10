import { Button, styled, TextField } from "@mui/material";
import { useState } from "react";
import CustomizedSnackbar from "../../commun/components/snackbar";
import { createDeliveryPrice } from "../../services/order";

const ContentContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
    textAlign: 'center',
    maxWidth: '500px',
    justifySelf: 'center',
    margin: '0 auto',
    padding: '0 20px',
    gap: 10,
}))

const Title = styled('h1')(({ theme }) => ({
    fontSize: 35,
    fontWeight: 100,
    color: theme.palette.text.primary,
    marginBottom: 8
}))

const SubTitle = styled('p')(({ theme }) => ({
    fontSize: 16,
    color: theme.palette.text.secondary,
    fontFamily: theme.typography.fontFamily,
    marginBottom: 40,
}))

const TitlesContainer = styled('div')(({ theme }) => ({
    alignSelf: 'center'
}))

const CreateOrderPrice = () => {
    const [state, setState] = useState({
        data: null,
        disabled: false,
        error: '',
    });

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        const data = {
            state: formData.get('state'),
            price: Number(formData.get('price')),
        };
        

        setState((prev) => ({ ...prev, disabled: true }));
        try {
            await createDeliveryPrice(data);
            window.location.href = '/admin/orders/prices';
        } catch (error) {
            setState((prev) => ({ ...prev, error }));
        } finally {
            setState((prev) => ({ ...prev, disabled: false }));
        }
    };

    return (
        <ContentContainer
            as="form"
            onSubmit={handleSubmit}
            sx={{ mt: 1 }}
        >
            <TitlesContainer>
                <Title>Create Delivery Price</Title>
                <SubTitle>Fill the following form to add a delivery price.</SubTitle>
            </TitlesContainer>
            <TextField
                margin="dense"
                id="state"
                name="state"
                label="State"
                type="text"
                fullWidth
                variant="outlined"
                slotProps={{
                    htmlInput: {
                        maxLength: 20,
                    },
                }}
                required
                disabled={state.disabled}
            />
            <TextField
                margin="dense"
                id="price"
                name="price"
                label="Price"
                type="number"
                fullWidth
                variant="outlined"
                slotProps={{
                    htmlInput: {
                        min: 0,
                        max: 1000000000,
                    },
                }}
                required
                disabled={state.disabled}
            />
            <Button
                type="submit"
                variant="contained"
                sx={{
                    width: '100%',
                    padding: 2,
                    marginTop: 5,
                }}
                loading={state.disabled}
                loadingPosition="end"
            >
                Create Delivery Price
            </Button>
            <CustomizedSnackbar
                open={Boolean(state.error)}
                message={state.error.message}
                handleClose={() =>
                    setState((prev) => ({ ...prev, error: '' }))
                }
                type={'error'}
            />
        </ContentContainer>
    );
};
 
export default CreateOrderPrice;