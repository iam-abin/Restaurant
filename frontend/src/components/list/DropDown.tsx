import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

export default function DropDown({ statusList }: { statusList: string[] }) {
    const [status, setStatus] = React.useState('');

    const handleChange = (event: SelectChangeEvent) => {
        setStatus(event.target.value);
    };

    return (
        <div>
            <FormControl sx={{ m: 1, minWidth: 150 }}>
                <Select displayEmpty id="status-select" value={status} onChange={handleChange} autoWidth>
                    <MenuItem value="" disabled>
                        Select Status
                    </MenuItem>
                    {statusList.map((status) => (
                        <MenuItem key={status} value={status}>
                            {status}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}
