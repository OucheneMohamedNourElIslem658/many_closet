import { Skeleton, styled } from "@mui/material";
import Selector from "../../../commun/components/option_selector";
import { PromiseBuilder } from "../../../commun/components/promise_builder";
import { getFilters } from "../../../services/product";

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

function formatePriceFilter(price) {
    if (price.max === Infinity) {
        return `${price.min}DA+`;
    } else {
        return `${price.min}DA-${price.max}DA`;
    }
}

const FiltersSideBar = ({ onSizeChanged = () => {}, onColorChanged = () => {}, onCategoryChanged = () => {}, onPriceChanged = () => {} }) => {
    const handlePriceChange = (price, isChecked) => {
        if (isChecked) {
            onPriceChanged(price);
        }
    };

    return ( 
        <div>
            <FiltersTitle>Filters</FiltersTitle>
            <PromiseBuilder
                promise={getFilters}
                loading={
                        <FiltersList>
                            <li>
                                <Selector title="Sizes" isLoading={true} />
                                <Selector title="Colors" isLoading={true} />
                                <div>
                                    <p>Prices</p>
                                    <PricesList style={{gap: 10}}>
                                        {
                                            Array.from({ length: 4 }).map((_, index) => (
                                                <li key={index}>
                                                    <Skeleton variant="rectangular" width={'60%'} height={15} style={{minWidth: 100}} />
                                                </li>
                                            ))
                                        }
                                    </PricesList>
                                </div>
                                <Selector title="Tags" isLoading={true} />
                            </li>
                        </FiltersList>
                }
                builder={(data) => (
                    <div>
                        <FiltersList>
                            <li>
                                <Selector title="Sizes" options={data.sizes} onOptionSelected={onSizeChanged}/>
                                <Selector title="Colors" options={data.colors} isColor={true} onOptionSelected={onColorChanged} />
                                <div>
                                    <p>Prices</p>
                                    <PricesList>
                                        {
                                            data.prices.map((price, index) => (
                                                <li key={index}>
                                                    <PriceItem>
                                                        <CustomCheckBox 
                                                            type="checkbox" 
                                                            onChange={(e) => handlePriceChange(price, e.target.checked)} 
                                                        />
                                                        {formatePriceFilter(price)}
                                                    </PriceItem>
                                                </li>
                                            ))
                                        }
                                    </PricesList>
                                </div>
                                <Selector title="Tags" options={data.categories} onOptionSelected={onCategoryChanged} />
                            </li>
                        </FiltersList>
                    </div>
                )}
            />
        </div>
    );
}

 
export default FiltersSideBar;