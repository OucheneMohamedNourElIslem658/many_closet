import { Button, IconButton, Skeleton, styled, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";

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

const Selector = ({ title, options, initialOptions = [], isColor, type = 'multi', isLoading = false, onOptionSelected = ([]) => {} }) => {
    const [filterOptions, setFilterOptions] = useState([]);
    
    function handleOptionSelection(option) {
        let updatedOptions;
        if (type === 'single') {
            updatedOptions = [option];
        } else if (type === 'multi') {
            updatedOptions = filterOptions.includes(option)
                ? filterOptions.filter((t) => t !== option)
                : [...filterOptions, option];
        }
        setFilterOptions(updatedOptions);
    }

    useEffect(() => {
        if (initialOptions && initialOptions.length > 0) {
            setFilterOptions([...initialOptions]);
        }
    }
    , []);

    useEffect(() => {
        onOptionSelected(filterOptions);
    }, [filterOptions])

    return (
        <div>
            <p>{isLoading ? <Skeleton width={100} /> : title}</p>
            <FiltersWithWrapedItems>
                {
                    isLoading ? (
                        Array.from({ length: 7 }).map((_, index) => (
                            <li key={index}>
                                {
                                    isColor ? (
                                        <Skeleton variant="rectangular" width={30} height={30} sx={{ borderRadius: 5 }} />
                                    ) : (
                                        <Skeleton variant="rectangular" width={50} height={30} style={{ borderRadius: 3 }} />
                                    )
                                }
                            </li>
                        ))
                    ) : (
                        options.map((option, index) => (
                            <li key={index}>
                                {
                                    isColor ? (
                                        <Tooltip title={option.name}>
                                            <ColorButton
                                                style={{ backgroundColor: isColor ? `#${option.hex}` : 'default' }}
                                                onClick={() => handleOptionSelection(option)}
                                                className={filterOptions.includes(option) ? 'selected' : ''}
                                            />
                                        </Tooltip>
                                    ) : (
                                        <OptionButton
                                            variant="outlined"
                                            onClick={() => handleOptionSelection(option)}
                                            className={filterOptions.includes(option) ? 'selected' : ''}
                                            style={{borderRadius: 0}}
                                        >
                                            {option.name}
                                        </OptionButton>
                                    )
                                }
                            </li>
                        ))
                    )
                }
            </FiltersWithWrapedItems>
        </div>
    );
};

export default Selector;