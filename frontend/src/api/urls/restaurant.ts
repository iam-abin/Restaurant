const RESTAURANT_URL = `/restaurant`;

const restaurantApiUrls = {
    getARestaurantUrl: (restaurantId: string) => `${RESTAURANT_URL}/${restaurantId}`,
    getMyRestaurantUrl: `${RESTAURANT_URL}`,
    editRestaurantUrl: (restaurantId: string) => `${RESTAURANT_URL}/${restaurantId}`,
};

export default restaurantApiUrls;
