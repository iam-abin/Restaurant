const CART_URL = '/cart';

const cartApiUrls = {
    addToCartUrl: `${CART_URL}`,
    getCartItemsUrl: (restaurantId: string, page: number, limit?: number) =>
        `${CART_URL}/${restaurantId}?page=${page ?? 1}${limit ? `&limit=${limit}` : ''}`,
    updateQuantityUrl: (cartItemId: string) => `${CART_URL}/quantity/${cartItemId}`,
    removeCartItemsUrl: `${CART_URL}`,
    removeCartItemUrl: (cartItemId: string) => `${CART_URL}/${cartItemId}`,
};

export default cartApiUrls;
