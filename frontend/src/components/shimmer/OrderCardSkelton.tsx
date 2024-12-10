import { Card, CardContent, Box, Grid, Skeleton } from '@mui/material';

const OrderCardSkelton = () => {
    return (
        <Grid item xs={12}>
            <Card sx={{ display: 'flex', alignItems: 'center' }}>
                <Skeleton
                    variant="rectangular"
                    sx={{
                        width: 120,
                        height: 120,
                        borderRadius: 2,
                        margin: 2,
                    }}
                />
                <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <CardContent>
                        <Skeleton variant="text" width="60%" />
                        <Skeleton variant="text" width="40%" />
                        <Skeleton variant="text" width="80%" />
                        <Skeleton variant="text" width="30%" />
                    </CardContent>
                </Box>
                <Box sx={{ padding: 2 }}>
                    <Skeleton variant="rectangular" width={100} height={36} />
                </Box>
            </Card>
        </Grid>
    );
};

export default OrderCardSkelton;
