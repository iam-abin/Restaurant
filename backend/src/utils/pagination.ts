/**
 * Calculates the skip value for pagination.
 * @param page - The current page number (1-based index).
 * @param limit - The number of documents per page.
 * @returns The skip value for database queries.
 */
export const getPaginationSkipValue = (page: number, limit: number): number => {
    return (page - 1) * limit;
};

/**
 * Calculates the total number of pages based on the total document count and limit.
 * @param totalDocuments - The total number of documents available.
 * @param limit - The number of documents per page.
 * @returns The total number of pages.
 */
export const getPaginationTotalNumberOfPages = (docsCount: number, limit: number): number => {
    return Math.ceil(docsCount / limit);
};
