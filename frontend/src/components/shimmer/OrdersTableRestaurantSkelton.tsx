import {
    Paper,
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';

interface IOrdersTableRestaurantSkeltonProps {
    rowCount: number;
}

const OrdersTableRestaurantSkelton: React.FC<IOrdersTableRestaurantSkeltonProps> = ({ rowCount }) => {
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <Skeleton variant="text" width={100} height={25} />
                        </TableCell>
                        <TableCell>
                            <Skeleton variant="text" width={100} height={25} />
                        </TableCell>
                        <TableCell>
                            <Skeleton variant="text" width={100} height={25} />
                        </TableCell>
                        <TableCell>
                            <Skeleton variant="text" width={100} height={25} />
                        </TableCell>
                        <TableCell>
                            <Skeleton variant="text" width={100} height={25} />
                        </TableCell>
                        <TableCell>
                            <Skeleton variant="text" width={100} height={25} />
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Array.from({ length: rowCount }).map((_, index) => (
                        <TableRow key={index}>
                            <TableCell>
                                <Skeleton variant="rectangular" width={50} height={50} />
                            </TableCell>
                            <TableCell>
                                <Skeleton variant="text" width={150} height={25} />
                            </TableCell>
                            <TableCell>
                                <Skeleton variant="text" width={150} height={25} />
                            </TableCell>
                            <TableCell>
                                <Skeleton variant="text" width={100} height={25} />
                            </TableCell>
                            <TableCell>
                                <Skeleton variant="text" width={100} height={25} />
                            </TableCell>
                            <TableCell>
                                <Skeleton variant="rectangular" width={100} height={36} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default OrdersTableRestaurantSkelton;
