const ORDER_URL = `/order`;

const orderApiUrls = {
    getMyOrdersUrl: `${ORDER_URL}`,
    addOrderUrl: `${ORDER_URL}/payment`,
    getRestaurantOrdersUrl: (restaurantId: string) =>
        `${ORDER_URL}/restaurant/${restaurantId}`,
    updateOrderStatusUrl: (orderId: string) =>
        `${ORDER_URL}/restaurant/${orderId}`,
};

export default orderApiUrls;
