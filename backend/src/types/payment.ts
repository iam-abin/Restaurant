export type CheckoutSessionRequest = {
    cartItems: { menuId: string }[];
    deliveryDetails: {
        name: string;
        email: string;
        address: string;
        city: string;
    };
    restaurantId: string;
};
