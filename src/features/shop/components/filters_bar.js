import { CloseOutlined, CloseRounded } from "@mui/icons-material";
import { Button, IconButton, styled } from "@mui/material";
import { useState } from "react";

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
    width: 30,
    height: 30,
    borderRadius: 5,
    fontSize: 12,
    padding: 0,
    textTransform: 'none',
    '&.selected': {
        backgroundColor: '#000',
        color: '#fff',
        '&:hover': {
            backgroundColor: '#000',
            color: '#fff',
        },
    },
})

const ColorButton = styled(IconButton)(({ theme }) => ({
    width: 30,
    height: 30,
    border: `1px solid ${theme.palette.secondary.main}`,
    '&.selected': {
        backgroundColor: '#000',
        color: '#fff',
        backgroundClip: 'content-box',
        padding: 3,
        border: `1px solid ${theme.palette.primary.main}`,
        '&:hover': {
            backgroundColor: '#000',
            color: '#fff',
        },
    },

    transition: 'padding 0.1s ease-in-out',
}))

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
    const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
    const colors = ['red', 'yellow', 'green', 'blue', 'black', 'white', 'grey', 'purple', 'pink', 'orange'];
    const prices = ['0DA-50DA', '50DA-100DA', '100DA-150DA', '150DA-200DA', '200DA+'];
    const tages = ['new', 'sale', 'popular', 'featured'];

    const [filterColors, setFilterColors] = useState([]);
    const [filterSizes, setFilterSizes] = useState([]);
    // const [filterPrice, setFilterPrice] = useState('');
    const [filterTags, setFilterTags] = useState([]);

    function setColors(color) {
        setFilterColors((prevTags) => {
            if (prevTags.includes(color)) {
                return prevTags.filter((t) => t !== color);
            } else {
                return [...prevTags, color];
            }
        });
    }

    function setSizes(size) {
        setFilterSizes((prevTags) => {
            if (prevTags.includes(size)) {
                return prevTags.filter((t) => t !== size);
            } else {
                return [...prevTags, size];
            }
        });
    }

    // function setPrice(price) {
    //     setFilterPrice(price);
    // }

    function setTag(tag) {
        setFilterTags((prevTags) => {
            if (prevTags.includes(tag)) {
                return prevTags.filter((t) => t !== tag);
            } else {
                return [...prevTags, tag];
            }
        });
    }

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
                                        {
                                            filterSizes.includes(size) ?
                                                <SizeButton variant="outlined" className="selected" onClick={() => setSizes(size)}>{size}</SizeButton> :
                                                <SizeButton variant="outlined" onClick={() => setSizes(size)}>{size}</SizeButton>
                                        }
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
                                        {
                                            filterColors.includes(color) ?
                                                <ColorButton variant="outlined" className="selected" onClick={() => setColors(color)} style={{ backgroundColor: color }}></ColorButton> :
                                                <ColorButton variant="outlined" onClick={() => setColors(color)} style={{ backgroundColor: color }}></ColorButton>
                                        }
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
                                        {
                                            filterTags.includes(tag) ?
                                                <SizeButton variant="outlined" className="selected" onClick={() => setTag(tag)}>{tag}</SizeButton> :
                                                <SizeButton variant="outlined" onClick={() => setTag(tag)}>{tag}</SizeButton>
                                        }
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