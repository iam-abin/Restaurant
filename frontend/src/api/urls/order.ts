const ORDER_URL = `/order`;

const orderApiUrls = {
    getMyOrdersUrl: (page: number, limit?: number) =>
        `${ORDER_URL}?page=${page ?? 1}${limit ? `&limit=${limit}` : ''}`,
    getRestaurantOrdersUrl: (restaurantId: string, page: number, limit?: number) =>
        `${ORDER_URL}/restaurant/${restaurantId}?page=${page ?? 1}${limit ? `&limit=${limit}` : ''}`,
    checkoutOrderUrl: `${ORDER_URL}/payment/checkout`,
    updateOrderStatusUrl: (orderId: string) => `${ORDER_URL}/restaurant/status/${orderId}`,
};

export default orderApiUrls;
