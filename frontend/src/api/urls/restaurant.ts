const RESTAURANT_URL = `/restaurant`;

const restaurantApiUrls = {
    getARestaurantUrl: (restaurantId: string) =>
        `${RESTAURANT_URL}/${restaurantId}`,
    getMyRestaurantUrl: `${RESTAURANT_URL}`,
    updateRestaurantUrl: (restaurantId: string) =>
        `${RESTAURANT_URL}/${restaurantId}`,
    searchRestaurantUrl: (
        searchText: string,
        searchQuery: string,
        selectedCuisines: string[]
    ) =>
        `${RESTAURANT_URL}/search/${searchText}?searchQuery=${searchQuery}&selectedCuisines=${selectedCuisines}`,
};

export default restaurantApiUrls;
