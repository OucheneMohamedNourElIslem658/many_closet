import { styled } from "@mui/material";
import Selector from "../../../commun/components/option_selector";
import { PromiseBuilder } from "../../../commun/components/promise_builder";
import { getFilters } from "../../../services/product";
import PriceSelector from "./price_selector";
import { useEffect, useState } from "react";

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

const FiltersSideBar = ({
    onSizeChanged = () => {}, 
    onColorChanged = () => {}, 
    onCategoryChanged = () => {}, 
    onPriceChanged = () => {}, 
    initialFilters
}) => {
    return ( 
        <div>
            <FiltersTitle>Filters</FiltersTitle>
            <PromiseBuilder
                promise={getFilters}
                loading={
                        <FiltersList>
                            <li>
                                <Selector title="Sizes" isLoading={true}/>
                                <Selector title="Colors" isLoading={true}/>
                                <PriceSelector isLoading={true} />
                                <Selector title="Tags" isLoading={true}/>
                            </li>
                        </FiltersList>
                }
                builder={(data) => {
                    const initialSelectedSizes = data.sizes.filter(size => initialFilters.sizes?.includes(size.name)) || [];
                    const initialSelectedColors = data.colors.filter(color => initialFilters.colors?.includes(color.name)) || [];
                    const initialSelectedCategories = data.categories.filter(category => initialFilters.tags?.includes(category.name)) || [];
                    const initialPrice = initialFilters.price || {};

                    return <div>
                        <FiltersList>
                            <li>
                                <Selector title="Sizes" options={data.sizes} onOptionSelected={onSizeChanged} initialOptions={initialSelectedSizes}/>
                                <Selector title="Colors" options={data.colors} isColor={true} onOptionSelected={onColorChanged} initialOptions={initialSelectedColors}/>
                                <PriceSelector options={data.prices} onPriceChanged={(price) => {
                                    console.log(price);
                                    
                                    onPriceChanged(price);
                                }} initialPrice={initialPrice}/>
                                <Selector title="Tags" options={data.categories} onOptionSelected={onCategoryChanged} initialOptions={initialSelectedCategories}/>
                            </li>
                        </FiltersList>
                    </div>
                }}
            />
        </div>
    );
}

 
export default FiltersSideBar;