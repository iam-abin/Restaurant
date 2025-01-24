import { debounce } from 'lodash';
import { useState } from 'react';
import { DEFAULT_PAGE_VALUE } from '../constants';

type UsePaginationProps = {
    initialPage: number;
    initialTotalPages: number;
};

const usePagination = ({
    initialPage = DEFAULT_PAGE_VALUE,
    initialTotalPages = DEFAULT_PAGE_VALUE,
}: Partial<UsePaginationProps>) => {
    const [currentPage, setCurrentPage] = useState<number>(initialPage);
    const [totalNumberOfPages, setTotalNumberOfPages] = useState<number>(initialTotalPages);

    const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number): void => {
        setCurrentPage(page);
    };
    const debouncedHandlePageChange = debounce(handlePageChange, 150);

    return {
        currentPage,
        totalNumberOfPages,
        setTotalNumberOfPages, // You can use this if you need to update the total number of pages
        handlePageChange: debouncedHandlePageChange,
    };
};

export default usePagination;
