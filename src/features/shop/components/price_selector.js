import { RefreshRounded } from "@mui/icons-material";
import { Skeleton, styled } from "@mui/material";
import { useEffect } from "react";

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

const PricesList = styled('ul')(({ theme }) => ({
    display: 'flex',
    listStyleType: 'none',
    flexDirection: 'column',
    padding: 0,
    fontFamily: theme.typography.fontFamily,
    fontSize: 14,
    color: theme.palette.text.primary,
    marginBottom: 10,
    marginTop: 5
}));

function formatePriceFilter(price) {
    if (price.max === Infinity) {
        return `${price.min}DA+`;
    } else {
        return `${price.min}DA-${price.max}DA`;
    }
}

const PriceSelector = ({onPriceChanged = () => {}, options, isLoading, initialPrice}) => {
    const handlePriceChange = (price, isChecked) => {
        if (isChecked) {
            onPriceChanged(price);
        }
    };

    const unSelectAll = () => {
        const radios = document.getElementsByName('price');
        radios.forEach(radio => radio.checked = false);
        handlePriceChange(null, true);
    };

    const isAnyPriceSelected = () => {
        const radios = document.getElementsByName('price');
        return Array.from(radios).some(radio => radio.checked);
    };

    useEffect(() => {
        if (initialPrice) {
            const radios = document.getElementsByName('price');
            radios.forEach(radio => {
                if (radio.value == initialPrice.min) {
                    radio.checked = true;
                    handlePriceChange(initialPrice);
                } else {
                    radio.checked = false;
                }
            });
        }
    }
    , [initialPrice]);

    return (
        <div>
            <div style={{display: 'flex', alignItems: 'end'}}>
                {
                    isLoading ? (
                        <Skeleton variant="rectangular" width={6} height={15} style={{minWidth: 100}} />
                    ) : (
                        <h2 style={{fontSize: 16, fontWeight: 500}}>Price</h2>
                    )
                }
                {isAnyPriceSelected() && (
                    <div onClick={unSelectAll} style={{cursor: 'pointer'}}>
                        <RefreshRounded style={{height: 15, position: 'relative', top: 3}}/>
                    </div>
                )}
            </div>
            {isLoading ? (
                <PricesList style={{gap: 10}}>
                    {
                        Array.from({ length: 4 }).map((_, index) => (
                            <li key={index}>
                                <Skeleton variant="rectangular" width={'60%'} height={15} style={{minWidth: 100}} />
                            </li>
                        ))
                    }
                </PricesList>
            ) : (    
                <PricesList>
                    {
                        options.map((price, index) => (
                            <li key={index}>
                                <PriceItem>
                                    <CustomCheckBox 
                                        type="radio" 
                                        name="price"
                                        value={price.min}
                                        onChange={(e) => handlePriceChange(price, e.target.checked)} 
                                    />
                                    {formatePriceFilter(price)}
                                </PriceItem>
                            </li>
                        ))
                    }
                </PricesList>
            )}
        </div>
    );
}
 
export default PriceSelector;