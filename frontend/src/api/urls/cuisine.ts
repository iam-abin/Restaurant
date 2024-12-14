const CUISINE_URL = `/cuisine`;

const cuisineApiUrls = {
    getCuisinesUrl: `${CUISINE_URL}`,
    searchCuisineUrl: (searchText?: string): string => `${CUISINE_URL}/search?searchText=${searchText ?? ''}`,
};

export default cuisineApiUrls;
