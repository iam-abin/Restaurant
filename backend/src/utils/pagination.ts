/**
 * Calculates the skip value for pagination.
 * @param {number} page - The current page number (1-based index).
 * @param {number} limit - The number of documents per page.
 * @returns The skip value for database queries.
 * @throws Will throw an error if page or limit is not a positive integer.
 */
export const getPaginationSkipValue = (page: number, limit: number): number => {
    if (!Number.isInteger(page) || !Number.isInteger(limit) || page < 1 || limit < 1) {
        throw new TypeError('Page and limit must be positive integers.');
    }
    return (page - 1) * limit;
};

/**
 * Calculates the total number of pages based on the total document count and limit.
 * @param {number} docsCount - The total number of documents available.
 * @param {number} limit - The number of documents per page.
 * @returns The total number of pages.
 * @throws Will throw an error if docsCount or limit is not a non-negative integer.
 */
export const getPaginationTotalNumberOfPages = (docsCount: number, limit: number): number => {
    if (!Number.isInteger(docsCount) || !Number.isInteger(limit) || docsCount < 0 || limit < 1) {
        throw new TypeError('docsCount must be a non-negative integer, and limit must be a positive integer');
    }
    return Math.ceil(docsCount / limit);
};
