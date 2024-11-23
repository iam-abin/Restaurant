const ORDER_URL = `/order`

const orderApiUrls = {
    getMyOrdersUrl: `${ORDER_URL}`,
    checkoutOrderUrl: `${ORDER_URL}/payment/checkout`,
    getRestaurantOrdersUrl: (restaurantId: string) => `${ORDER_URL}/restaurant/${restaurantId}`,
    updateOrderStatusUrl: (orderId: string) => `${ORDER_URL}/restaurant/${orderId}`
}

export default orderApiUrls
