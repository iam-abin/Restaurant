const CUISINE_URL = `/cuisine`;

const cuisineApiUrls = {
    searchCuisineUrl: (searchText?: string): string => `${CUISINE_URL}/search?searchText=${searchText ?? ''}`,
};

export default cuisineApiUrls;
