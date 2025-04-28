import { Button, styled, TextField } from "@mui/material";
import CollectionItemsPicker from "./components/collection_items_picker";
import CustomSwitch from "./components/custom_switch";
import ImagesPicker from "./components/images_picker";

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

const CreateProductPage = () => {
    return (
        <ContentContainer>
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
            <CustomSwitch label={'available'}/>
            <ImagesPicker/>
            <FieldsTitles>Colors</FieldsTitles>
            <CollectionItemsPicker
                initialItems={[
                    {id: 1, code: '#FF0000', name: 'Red'},
                    {id: 2, code: '#00FF00', name: 'Green'},    
                    {id: 3, code: '#0000FF', name: 'Blue'},
                    {id: 4, code: '#000000', name: 'Black'},
                    {id: 5, code: '#FFFFFF', name: 'White'},
                ]}
            />
            <FieldsTitles>Sizes</FieldsTitles>
            <CollectionItemsPicker
                initialItems={[
                    {id: 1, name: 'S'},
                    {id: 2, name: 'M'},    
                    {id: 3, name: 'L'},
                    {id: 4, name: 'XL'},
                    {id: 5, name: 'XXL'},
                ]}
            />
            <FieldsTitles>Categories</FieldsTitles>
            <CollectionItemsPicker
                initialItems={[
                    {id: 1, name: 'T-Shirts'},
                    {id: 2, name: 'Pants'},    
                    {id: 3, name: 'Shoes'},
                    {id: 4, name: 'Hats'},
                    {id: 5, name: 'Accessories'},
                ]}
            />
            <Button type="submit" variant="contained" sx={{ width: '100%', padding: 2, marginTop: 5 }}>
                Create Product
            </Button>
        </ContentContainer>
    );
}
 
export default CreateProductPage;