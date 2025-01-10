import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import CustomButton from '../../components/Button/CustomButton';

const Error404: React.FC = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/'); // Redirects to the home page
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100vh"
            bgcolor="background.default"
            color="text.primary"
            textAlign="center"
            p={2}
        >
            <h1 className="text-9xl font-extrabold text-gray-800 animate-bounce">404</h1>
            <Typography variant="h5" gutterBottom>
                Oops! The page you&apos;re looking for doesn&apos;t exist.
            </Typography>
            <Typography variant="body1" mb={3}>
                It might have been moved or deleted.
            </Typography>
            <CustomButton sx={{ textTransform: 'none', fontWeight: 'bold' }} onClick={handleGoHome}>
                Back to Home
            </CustomButton>
            {/* <Button
                variant="contained"
                color="primary"
                onClick={handleGoHome}
                sx={{ textTransform: 'none', fontWeight: 'bold' }}
            >
                Go Back Home
            </Button> */}
        </Box>
    );
};

export default Error404;
