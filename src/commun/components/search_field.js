import { SearchRounded } from "@mui/icons-material";
import { FormControl, InputAdornment, OutlinedInput } from "@mui/material";

const SearchField = () => {
    return (
        <FormControl variant="outlined">
            <OutlinedInput
                size="small"
                id="search"
                placeholder="Search…"
                sx={{ flexGrow: 1 }}
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