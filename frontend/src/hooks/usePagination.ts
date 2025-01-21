import { useState } from 'react';

type UsePaginationProps = {
    initialPage: number;
    initialTotalPages: number;
};

const usePagination = ({ initialPage = 1, initialTotalPages = 1 }: Partial<UsePaginationProps>) => {
    const [currentPage, setCurrentPage] = useState<number>(initialPage);
    const [totalNumberOfPages, setTotalNumberOfPages] = useState<number>(initialTotalPages);

    const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number): void => {
        setCurrentPage(page);
    };

    return {
        currentPage,
        totalNumberOfPages,
        setTotalNumberOfPages, // You can use this if you need to update the total number of pages
        handlePageChange,
    };
};

export default usePagination;
