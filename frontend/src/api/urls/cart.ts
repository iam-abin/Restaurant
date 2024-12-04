const CART_URL = `/cart`;

const cartApiUrls = {
    addToCartUrl: `${CART_URL}`,
    getCartItemsUrl: (restaurantId: string) => `${CART_URL}/${restaurantId}`,
    updateQuantityUrl: (cartItemId: string) => `${CART_URL}/${cartItemId}`,
    removeCartItemsUrl: `${CART_URL}`,
    removeCartItemUrl: (cartItemId: string) => `${CART_URL}/${cartItemId}`,
};

export default cartApiUrls;
