const ORDER_URL = `/order`;

const orderApiUrls = {
    getMyOrdersUrl: `${ORDER_URL}`,
    getRestaurantOrdersUrl: (restaurantId: string) => `${ORDER_URL}/restaurant/${restaurantId}`,
    checkoutOrderUrl: `${ORDER_URL}/payment/checkout`,
    updateOrderStatusUrl: (orderId: string) => `${ORDER_URL}/restaurant/${orderId}`,
};

export default orderApiUrls;
