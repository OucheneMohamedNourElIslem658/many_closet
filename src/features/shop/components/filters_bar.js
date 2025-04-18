import { styled } from "@mui/material";
import Selector from "../../../commun/components/option_selector";
import { PromiseBuilder } from "../../../commun/components/promise_builder";
import { getFilters } from "../../../services/product";
import PriceSelector from "./price_selector";

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

const FiltersTitle = styled('h2')({
    marginBottom: 15,
    fontWeight: '500',
    fontSize: 28
})

const FiltersSideBar = ({ onSizeChanged, onColorChanged, onCategoryChanged, onPriceChanged }) => {
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
                                <PriceSelector isLoading={true} />
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
                                <PriceSelector options={data.prices} onPriceChanged={onPriceChanged}/>
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