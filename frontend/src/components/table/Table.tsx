import { useEffect } from 'react';
import {
    Table as MuiTable,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
} from '@mui/material';
import { IProfile } from '../../types';
import usePagination from '../../hooks/usePagination';
import PaginationButtons from '../pagination/PaginationButtons';

interface ITableProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    columns: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any[];
    numberOfPages: number;
    fetchData: (page: number) => Promise<void>;
}

const Table: React.FC<ITableProps> = ({ columns, data, numberOfPages, fetchData }) => {
    //  eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getNestedValue = (nestedObj: any, path: string) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return path.split('.').reduce((acc: any, curr: string) => acc && acc[curr], nestedObj);
    };

    const { currentPage, handlePageChange, totalNumberOfPages, setTotalNumberOfPages } = usePagination({});

    useEffect(() => {
        (async () => {
            await fetchData(currentPage);
            setTotalNumberOfPages(numberOfPages);
        })();
    }, [currentPage, numberOfPages]);

    return (
        <>
            <TableContainer component={Paper} elevation={3}>
                <MuiTable>
                    <TableHead>
                        <TableRow>
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {columns.map((col: any, index: number) => (
                                <TableCell
                                    align="center"
                                    key={index}
                                    sx={{ fontWeight: 'bold', backgroundColor: 'gray', color: 'white' }}
                                >
                                    {col.Header}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data && data.length > 0 ? (
                            data.map((row: IProfile, rowIndex: number) => (
                                <TableRow
                                    key={rowIndex}
                                    sx={{
                                        backgroundColor: rowIndex % 2 === 0 ? 'white' : 'grey.100',
                                    }}
                                >
                                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                    {columns.map((col: any, index: number) => (
                                        <TableCell key={index} align="center">
                                            {col.element
                                                ? col.element(row)
                                                : getNestedValue(row, col.accessor)}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} align="center">
                                    <Typography variant="body1" color="textSecondary">
                                        No data available
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </MuiTable>
            </TableContainer>
            <div className="flex justify-center my-5">
                <PaginationButtons
                    handlePageChange={handlePageChange}
                    numberOfPages={totalNumberOfPages}
                    currentPage={currentPage}
                />
            </div>
        </>
    );
};

export default Table;
