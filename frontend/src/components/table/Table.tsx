import { useEffect } from 'react';
import { IProfile } from '../../types';
import PaginationButtons from '../pagination/PaginationButtons';
import usePagination from '../../hooks/usePagination';

const Table = ({
    columns,
    data,
    numberOfPages,
    fetchData,
}: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    columns: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any[];
    numberOfPages: number;
    fetchData: (page: number) => Promise<void>;
}) => {
    //  eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getNestedValue = (nestedObj: any, path: string) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return path.split('.').reduce((acc: any, curr: string) => acc && acc[curr], nestedObj);
    };

    const { currentPage, handlePageChange, totalNumberOfPages, setTotalNumberOfPages } = usePagination({});

    // const handlePageChange = async (pageNumber: number) => {
    //     setCurrentPage(pageNumber);
    //     await fetchData(pageNumber); // Fetch data for the new page
    // };

    // useEffect(() => {
    //     setCurrentPage(currentPage);
    // }, [data]);

    useEffect(() => {
        // setCurrentPage(currentPage);
        (async () => {
            await fetchData(currentPage);
            setTotalNumberOfPages(numberOfPages);
        })();
    }, [currentPage, numberOfPages]);

    return (
        <>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 shadow-xl">
                    <thead>
                        <tr className="border-b bg-gray-700">
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {columns.map((col: any, index: number) => (
                                <th
                                    key={index}
                                    className="py-3 px-6 text-center text-sm font-medium text-white uppercase tracking-wider"
                                >
                                    {col.Header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data && data.length > 0 ? (
                            data.map((row: IProfile, rowIndex: number) => (
                                <tr
                                    key={rowIndex}
                                    className={`${rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-200'} border-b`}
                                >
                                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                    {columns.map((col: any, index: number) => (
                                        <td
                                            key={index}
                                            className="py-4 px-6 text-center text-sm text-gray-700"
                                        >
                                            {col.button
                                                ? col.button(row) // Use custom Cell if defined
                                                : getNestedValue(row, col.accessor)}{' '}
                                            {/* Default to accessor */}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="py-4 text-center text-gray-700">
                                    No data available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-center my-10">
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
