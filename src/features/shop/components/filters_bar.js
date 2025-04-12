import { styled } from "@mui/material";
import Selector from "../../../commun/components/option_selector";

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
}));

const CustomCheckBox = styled('input')(({ theme }) => ({
    borderRadius: 5,
    border: `1px solid ${theme.palette.primary.main}`,
    backgroundColor: theme.palette.background.paper,
    '&:checked': {
        accentColor: theme.palette.primary.main,
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
    const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
    const colors = ['red', 'yellow', 'green', 'blue', 'black', 'white', 'grey', 'purple', 'pink', 'orange'];
    const prices = ['0DA-50DA', '50DA-100DA', '100DA-150DA', '150DA-200DA', '200DA+'];
    const tages = ['new', 'sale', 'popular', 'featured'];

    return ( 
        <div>
            <FiltersTitle>Filters</FiltersTitle>
            <FiltersList>
                <li>
                    <Selector title="Sizes" options={sizes} />
                    <Selector title="Colors" options={colors} isColor={true}/>
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
                    <Selector title="Tags" options={tages} />
                </li>
            </FiltersList>
        </div>
    );
}

 
export default FiltersSideBar;