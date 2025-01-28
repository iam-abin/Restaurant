import React from 'react';
import { Chip, ChipProps } from '@mui/material';

type OrderStatus = 'confirmed' | 'delivered' | 'outfordelivery' | 'pending' | 'preparing';

const ChipCustom: React.FC<{ status: OrderStatus }> = ({ status }) => {
    // Explicitly define chip properties for each status
    const getChipProps = (status: OrderStatus): Pick<ChipProps, 'color' | 'label' | 'style'> => {
        switch (status) {
            case 'confirmed':
                return { color: 'success', label: 'Confirmed' }; // Green for success
            case 'delivered':
                return { color: 'info', label: 'Delivered' }; // Blue for info
            case 'outfordelivery':
                return { color: 'warning', label: 'Out for Delivery' }; // Yellow for in-progress
            case 'pending':
                return { color: 'default', label: 'Pending' }; // Gray for pending
            case 'preparing':
                return { color: 'primary', label: 'Preparing' }; // Blue for preparing
            default:
                return { color: 'default', label: 'Unknown Status' }; // Fallback
        }
    };

    const chipProps = getChipProps(status);

    // Spread props into the Chip component
    return <Chip {...chipProps} size="small" />;
};

export default ChipCustom;
