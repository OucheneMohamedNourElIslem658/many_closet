import { SearchRounded } from "@mui/icons-material";
import { FormControl, InputAdornment, OutlinedInput } from "@mui/material";

const SearchField = ({placeholder = 'Search...', onValueChanged = () => {}}) => {
    return (
        <FormControl variant="outlined">
            <OutlinedInput style={{borderRadius: 0}}
                size="small"
                id="search"
                placeholder={placeholder}
                sx={{ flexGrow: 1 }}
                onChange={(event) => onValueChanged(event.target.value)}
                startAdornment={
                <InputAdornment position="start" sx={{ color: 'text.primary' }}>
                    <SearchRounded fontSize="small" />
                </InputAdornment>
                }
                inputProps={{
                'aria-label': 'search',
                }}
            />
        </FormControl>
    );
}
 
export default SearchField;