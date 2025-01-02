export const getPaginationSkipValue = (page: number, limit: number): number => {
    const skip: number = (page - 1) * limit;
    return skip;
};

export const getPaginationTotalNumberOfPages = (docsCount: number, limit: number): number => {
    const numberOfPages: number = Math.ceil(docsCount / limit);
    return numberOfPages;
};
