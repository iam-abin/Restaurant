import Button from '@mui/material/Button';
import { SxProps, Theme } from '@mui/material';

interface IReusableButtonProps {
    className?: string;
    color?: 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
    variant?: 'text' | 'outlined' | 'contained';
    sx?: SxProps<Theme>; // Added support for sx prop
    onClick?: () => void;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset'; // Add support for type
    children: React.ReactNode;
}

const CustomButton: React.FC<IReusableButtonProps> = ({
    className = '',
    color = 'warning',
    variant = 'contained',
    sx = {}, // Default empty sx prop
    onClick,
    disabled = false,
    type = 'button', // Default to "button"
    children,
}) => {
    return (
        <Button
            className={className}
            color={color}
            variant={variant}
            sx={sx}
            onClick={onClick}
            disabled={disabled}
            type={type} // Pass the type prop
        >
            {children}
        </Button>
    );
};

export default CustomButton;
