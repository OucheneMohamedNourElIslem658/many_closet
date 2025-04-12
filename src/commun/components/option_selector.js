import { Button, IconButton, styled } from "@mui/material";
import { useState } from "react";

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

const OptionButton = styled(Button)({
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

const Selector = ({title, options, isColor, type = 'multi'}) => {
    const [filterOptions, setFilterOptions] = useState([]);
    
    function handleOptionSelection(option) {
        if (type === 'single') {
            setFilterOptions([option]);
        } else if (type === 'multi') {
            setFilterOptions((prevTags) => {
                if (prevTags.includes(option)) {
                    return prevTags.filter((t) => t !== option);
                } else {
                    return [...prevTags, option];
                }
            });
        }
    }

    return (
        <div>
            <p>{title}</p>
            <FiltersWithWrapedItems>
                {
                    options.map((option, index) => (
                        <li key={index}>
                            {
                                isColor ? (
                                    <ColorButton style={{backgroundColor: isColor ? option : 'default'}} option={option} onClick={() => handleOptionSelection(option)} className={filterOptions.includes(option) ? 'selected' : ''}/>
                                ) : (
                                    <OptionButton variant="outlined" onClick={() => handleOptionSelection(option)} className={filterOptions.includes(option) ? 'selected' : ''}>
                                        {option}
                                    </OptionButton>
                                )
                            }
                        </li>
                    ))
                }
            </FiltersWithWrapedItems>
        </div>
    );
}

export default Selector;