import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";

const Error404: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/"); // Redirects to the home page
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
      <Typography variant="h1" fontWeight="bold">
        404
      </Typography>
      <Typography variant="h5" gutterBottom>
        Oops! The page you're looking for doesn't exist.
      </Typography>
      <Typography variant="body1" mb={3}>
        It might have been moved or deleted.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleGoHome}
        sx={{ textTransform: "none", fontWeight: "bold" }}
      >
        Go Back Home
      </Button>
    </Box>
  );
};

export default Error404;
