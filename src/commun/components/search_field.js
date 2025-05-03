import { SearchRounded } from "@mui/icons-material";
import { Button, FormControl, InputAdornment, OutlinedInput } from "@mui/material";

const SearchField = ({placeholder = 'Search...', defaultValue = null, onValueChanged = () => {}}) => {
    return (
        <FormControl 
            variant="outlined" 
            component={'form'}
            onSubmit={(event) => {
                event.preventDefault();
                const formData = new FormData(event.currentTarget);
                const query = formData.get('query');
                onValueChanged(query);
            }}
        >
            <OutlinedInput style={{borderRadius: 0}}
                size="small"
                id="search"
                name="query"
                placeholder={placeholder}
                sx={{ flexGrow: 1 }}
                defaultValue={defaultValue}
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