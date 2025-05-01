import { Button, CircularProgress, FormControlLabel, Skeleton, styled, Switch, TextField } from "@mui/material";
import CollectionItemsPicker from "./components/collection_items_picker";
import ImagesPicker from "./components/images_picker";
import { Fragment, useEffect, useState } from "react";
import { PromiseBuilder } from "../../commun/components/promise_builder";
import { createProduct, getFilters, getUpdateProductInfo, updateProduct } from "../../services/product";
import ErrorComponent from "../../commun/components/error";
import ActionConfirmationDialog from "../landing/components/action_confirmation_dialog";
import CustomizedSnackbar from "../../commun/components/snackbar";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import images from "../../commun/utils/images";

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

const FieldsTitles = styled('p')(({ theme }) => ({
    fontSize: 18,
    color: theme.palette.text.primary,
    marginTop: 10,
}))

const FiltersContainer = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    alignItems: 'start'
})

const UpdateProductPage = () => {
    const {id} = useParams()
    
    const [state, setState] = useState({
        data: null,
        loadingState: true,
        errorState: null,
        selectedSizes: [],
        selectedColors: [],
        selectedCategories: [],
        isAvailable: true,
        disabled: false,
        error: '',
        imagesToDelete: [],
    });

    useEffect(() => {
        let isMounted = true;
        setState((prev) => ({ ...prev, loadingState: true }));
        getUpdateProductInfo(id)
            .then((res) => {
                if (isMounted) {
                    setState((prev) => {
                        const updatedState = {
                            ...prev,
                            data: res,
                            loadingState: false,
                            isAvailable: res.product.is_available,
                        };
                        return updatedState;
                    });
                }
            })
            .catch((err) => {
                if (isMounted) {
                    setState((prev) => ({
                        ...prev,
                        errorState: err,
                        loadingState: false,
                    }));
                }
            });

        return () => {
            isMounted = false;
        };
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        const data = {
            name: formData.get('name'),
            description: formData.get('description'),
            price: formData.get('price'),
            available: state.isAvailable,
            images: formData.getAll('images'),
            imagesToDelete: state.imagesToDelete,
            colors: state.selectedColors,
            sizes: state.selectedSizes,
            categories: state.selectedCategories,
        };

        setState((prev) => ({ ...prev, disabled: true }));
        try {
            await updateProduct({...data, id});
            window.location.href = '/admin/products';
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
                <Title>Update Product</Title>
                <SubTitle>Fill the following form to update this product.</SubTitle>
            </TitlesContainer>
            {state.loadingState ? (
                <CircularProgress style={{alignSelf: 'center'}}/>
            ) : state.errorState ? (
                <ErrorComponent error={state.errorState.message} />
            ) : (
                <>
                    <TextField
                        margin="dense"
                        id="name"
                        name="name"
                        label="Name"
                        type="text"
                        fullWidth
                        variant="outlined"
                        slotProps={{
                            htmlInput: {
                                maxLength: 50,
                            },
                        }}
                        required
                        disabled={state.disabled}
                        defaultValue={state.data?.product.name || ''}
                    />
                    <TextField
                        margin="dense"
                        id="description"
                        name="description"
                        label="Description"
                        type="text"
                        fullWidth
                        variant="outlined"
                        rows={3}
                        multiline
                        slotProps={{
                            htmlInput: {
                                maxLength: 500,
                            },
                        }}
                        required
                        disabled={state.disabled}
                        defaultValue={state.data?.product.desc || ''}
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
                        defaultValue={state.data?.product.price || ''}
                    />
                    <FormControlLabel
                        control={<Switch checked={state.isAvailable} />}
                        label={'available'}
                        value={state.data?.product.is_available}
                        onChange={(_, checked) => {
                            setState((prev) => ({ ...prev, isAvailable: checked }));
                        }}
                        disabled={state.disabled}
                    />
                    <ImagesPicker
                        disabled={state.disabled}
                        initialImages={state.data?.product.images || []}
                        imagesToDelete={(images) => setState((prev) => ({ ...prev, imagesToDelete: images }))}
                    />
                    <FiltersContainer>
                        <FieldsTitles>Colors</FieldsTitles>
                        <CollectionItemsPicker
                            type="colors"
                            initialItems={state.data.filters.colors}
                            initialSelectedItems={state.data.product.colors}
                            onItemsChanged={(items) =>
                                setState((prev) => ({
                                    ...prev,
                                    selectedColors: items,
                                }))
                            }
                            disabled={state.disabled}
                        />
                        <FieldsTitles>Sizes</FieldsTitles>
                        <CollectionItemsPicker
                            type="sizes"
                            initialItems={state.data.filters.sizes}
                            initialSelectedItems={state.data.product.sizes}
                            onItemsChanged={(items) => {
                                setState((prev) => ({
                                    ...prev,
                                    selectedSizes: items,
                                }))
                            }}
                            disabled={state.disabled}
                        />
                        <FieldsTitles>Categories</FieldsTitles>
                        <CollectionItemsPicker
                            type="categories"
                            initialItems={state.data.filters.categories}
                            initialSelectedItems={state.data.product.categories}
                            onItemsChanged={(items) =>
                                setState((prev) => ({
                                    ...prev,
                                    selectedCategories: items,
                                }))
                            }
                            disabled={state.disabled}
                        />
                    </FiltersContainer>
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
                        Create Product
                    </Button>
                    <CustomizedSnackbar
                        open={Boolean(state.error)}
                        message={state.error.message}
                        handleClose={() =>
                            setState((prev) => ({ ...prev, error: '' }))
                        }
                        type={'error'}
                    />
                </>
            )}
        </ContentContainer>
    );
};
 
export default UpdateProductPage;