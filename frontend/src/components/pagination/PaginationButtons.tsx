import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

type PaginationButtonsProps = {
    handlePageChange: (event: React.ChangeEvent<unknown>, page: number) => void;
    numberOfPages: number;
    currentPage: number;
};
const PaginationButtons: React.FC<PaginationButtonsProps> = ({
    handlePageChange,
    numberOfPages,
    currentPage,
}) => {
    return (
        <>
            {numberOfPages > 1 && (
                <Stack spacing={2}>
                    <Pagination
                        count={numberOfPages}
                        onChange={handlePageChange}
                        page={currentPage}
                        showFirstButton
                        showLastButton
                    />
                </Stack>
            )}
        </>
    );
};

export default PaginationButtons;
