import { Button, FormControlLabel, styled, Switch, TextField } from "@mui/material";
import CollectionItemsPicker from "./components/collection_items_picker";
import CustomSwitch from "./components/custom_switch";
import ImagesPicker from "./components/images_picker";
import { useState } from "react";
import { PromiseBuilder } from "../../commun/components/promise_builder";
import { getFilters } from "../../services/product";

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

const CreateProductPage = () => {
    let [selectedSizes, setSizes] = useState([])
    let [selectedColors, setColors] = useState([])
    let [selectedCategories, setCategories] = useState([])
    const [isAvailable, setIsAvailable] = useState(true)

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const data = {
            name: formData.get('name'),
            description: formData.get('description'),
            price: formData.get('price'),
            available: isAvailable,
            images: formData.getAll('images'),
            colors: selectedColors,
            sizes: selectedSizes,
            categories: selectedCategories,
        };

        console.log(data);
    }

    return (
        <ContentContainer
            as="form"
            onSubmit={handleSubmit}
            sx={{ mt: 1 }}
        >
            <TitlesContainer>
                <Title>Create Product</Title>
                <SubTitle>Fill the following form to add a product.</SubTitle>
            </TitlesContainer>
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
                    }
                }}
                required
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
                    }
                }}
                required
            />
            <FormControlLabel 
                control={<Switch defaultChecked />} 
                label={'available'} 
                value={isAvailable} 
                onChange={(_, checked) => {
                    setIsAvailable(checked)
                }}
            />
            <ImagesPicker/>
            <PromiseBuilder
                promise={() => getFilters()}
                loading={
                    <FiltersContainer>
                        <FieldsTitles>Colors</FieldsTitles>
                        <CollectionItemsPicker isLoading={true}/>
                        <FieldsTitles>Sizes</FieldsTitles>
                        <CollectionItemsPicker isLoading={true}/>
                        <FieldsTitles>Categories</FieldsTitles>
                        <CollectionItemsPicker isLoading={true}/>
                    </FiltersContainer>
                }
                builder={(data) => {
                    console.log(data);
                    
                    const colors = data.colors.map((color) => ({
                        id: color.id,
                        name: color.name,
                        code: color.hex,
                    }))

                    const sizes = data.sizes
                    const cats = data.categories

                    console.log(colors);
                    
                    return <FiltersContainer>
                        <FieldsTitles>Colors</FieldsTitles>
                        <CollectionItemsPicker
                            type='color'
                            initialItems={colors}
                            onItemsChanged={(items) => selectedColors = items}
                        />
                        <FieldsTitles>Sizes</FieldsTitles>
                        <CollectionItemsPicker
                            initialItems={sizes}
                            onItemsChanged={(items) => selectedSizes = items}
                        />
                        <FieldsTitles>Categories</FieldsTitles>
                        <CollectionItemsPicker
                            initialItems={cats}
                            onItemsChanged={(items) => selectedCategories = items}
                        />
                    </FiltersContainer>
                }}
            />
            <Button type='submit' variant="contained" sx={{ width: '100%', padding: 2, marginTop: 5 }}>
                Create Product
            </Button>
        </ContentContainer>
    );
}
 
export default CreateProductPage;