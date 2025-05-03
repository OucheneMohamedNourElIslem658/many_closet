import { KeyboardArrowDownRounded } from "@mui/icons-material";
import { MenuItem, Select } from "@mui/material";
import { useEffect, useState } from "react";
import theme from "../../../commun/utils/theme";

const StatusDrodown = ({disabled, initialValue, statuses, borderType = 'underline', onChange = () => {}}) => {
    const [value, setValue] = useState('All');

    useEffect(() => {
      if (initialValue && statuses.includes(initialValue)) {
        setValue(initialValue);
      }
    }, [initialValue]);
  
    return (
      <Select
        value={value}
        id="status"
        name="status"
        fullWidth
        variant="standard"
        required
        disabled={disabled}
        IconComponent={() => <KeyboardArrowDownRounded />}
        onChange={(event) => {
          setValue(event.target.value);
          onChange(event.target.value);
        }}
        sx={{
          width: 150,
          borderBottom: borderType === 'underline' ? '1px solid' : 'none',
          border: borderType === 'box' ? `1px solid ${theme.palette.grey[300]}` : 'none',
          height: '40px',
          borderRadius: borderType === 'box' ? '4px' : '0px',
        }}
      >
        {statuses.map((status) => (
          <MenuItem key={status} value={status}>
            {status}
          </MenuItem>
        ))}
      </Select>
    );
}

export default StatusDrodown;