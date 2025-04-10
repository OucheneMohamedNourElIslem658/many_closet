import { Button, IconButton, styled } from "@mui/material";

const FiltersList = styled('ul')(({ theme }) => ({
    display: 'flex',
    listStyleType: 'none',
    gap: 20,
    flexDirection: 'column',
    margin: 0,
    padding: 0,
    fontFamily: theme.typography.fontFamily,
    fontSize: 14,
    color: theme.palette.text.primary,
}));

const FiltersWithWrapedItems = styled('ul')(({ theme }) => ({
    display: 'flex',
    listStyleType: 'none',
    gap: 10,
    flexWrap: 'wrap',
    margin: 0,
    padding: 0,
    fontFamily: theme.typography.fontFamily,
    fontSize: 14,
    color: theme.palette.text.primary,
    marginBottom: 25,
    marginTop: 10,
}));

const PricesList = styled('ul')(({ theme }) => ({
    display: 'flex',
    listStyleType: 'none',
    flexDirection: 'column',
    margin: 0,
    padding: 0,
    fontFamily: theme.typography.fontFamily,
    fontSize: 14,
    color: theme.palette.text.primary,
    marginBottom: 10,
    marginTop: 10
}));

const FiltersTitle = styled('h2')({
    marginBottom: 15
})

const SizeButton = styled(Button)({
})

const ColorButton = styled(IconButton)({
    width: 30,
    height: 30,
})

const PriceItem = styled('label')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    fontFamily: theme.typography.fontFamily,
    fontSize: 14,
    marginBottom: 5,
    color: theme.palette.secondary.main,
    '& input': {
        marginRight: 10,
    },
    '& input:checked': {
        backgroundColor: theme.palette.primary.main,
    },
    '& input:hover': {
        backgroundColor: theme.palette.primary.main,
    },
    '& input:focus': {
        backgroundColor: theme.palette.primary.main,
    },
    '& input:disabled': {
        backgroundColor: theme.palette.primary.main,
    },
    '& input:disabled:hover': {
        backgroundColor: theme.palette.primary.main,
    },
    '& input:disabled:focus': {
        backgroundColor: theme.palette.primary.main,
    },
    '& input:disabled:checked': {
        backgroundColor: theme.palette.primary.main,
    },
    '& input:disabled:checked:hover': {
        backgroundColor: theme.palette.primary.main,
    },
    '& input:disabled:checked:focus': {
        backgroundColor: theme.palette.primary.main,
    },
    '& input:disabled:checked:focus-visible': {
        backgroundColor: theme.palette.primary.main,
    },
}));

const CustomCheckBox = styled('input')(({ theme }) => ({
    borderRadius: 5,
    border: `1px solid ${theme.palette.primary.main}`,
    backgroundColor: theme.palette.background.paper,
    '&:checked': {
        backgroundColor: theme.palette.primary.main,
        border: `1px solid ${theme.palette.primary.main}`,
    },
    '&:hover': {
        backgroundColor: theme.palette.primary.main,
        border: `1px solid ${theme.palette.primary.main}`,
    },
    '&:focus': {
        backgroundColor: theme.palette.primary.main,
        border: `1px solid ${theme.palette.primary.main}`,
    },
}))

const FiltersSideBar = () => {
    const sizes = ['All', 'S', 'M', 'L', 'XL', 'XXL'];
    const colors = ['red', 'yellow', 'green', 'blue', 'black', 'white', 'grey', 'purple', 'pink', 'orange'];
    const prices = ['0DA-50DA', '50DA-100DA', '100DA-150DA', '150DA-200DA', '200DA+'];
    const tages = ['new', 'sale', 'popular', 'featured'];

    return ( 
        <div>
            <FiltersTitle>Filters</FiltersTitle>
            <FiltersList>
                <li>
                    <div>
                        <p>Size</p>
                        <FiltersWithWrapedItems>
                            {
                                sizes.map((size, index) => (
                                    <li key={index}>
                                        <SizeButton variant="outlined">{size}</SizeButton>
                                    </li>
                                ))
                            }
                        </FiltersWithWrapedItems>
                    </div>
                    <div>
                        <p>Colors</p>
                        <FiltersWithWrapedItems>
                            {
                                colors.map((color, index) => (
                                    <li key={index}>
                                        <ColorButton style={{ backgroundColor: color }}></ColorButton>
                                    </li>
                                ))
                            }
                        </FiltersWithWrapedItems>
                    </div>
                    <div>
                        <p>Prices</p>
                        <PricesList>
                            {
                                prices.map((price, index) => (
                                    <li key={index}>
                                        <PriceItem>
                                            <CustomCheckBox type="checkbox" />
                                            {price}
                                        </PriceItem>
                                    </li>
                                ))
                            }
                        </PricesList>
                    </div>
                    <div>
                        <p>Tags</p>
                        <FiltersWithWrapedItems>
                            {
                                tages.map((tag, index) => (
                                    <li key={index}>
                                        <Button variant="outlined">{tag}</Button>
                                    </li>
                                ))
                            }
                        </FiltersWithWrapedItems>
                    </div>
                </li>
            </FiltersList>
        </div>
    );
}
 
export default FiltersSideBar;