export interface IOrder {
    userId: string;
    restaurantId: string;
    // cartId: string;
    addressId: string;
    totalAmound: number;
    status: 'pending' | 'confirmed' | 'preparing' | 'outfordelivery' | 'delivered';
}

export interface IOrderedItem {
    userId: string;
    orderId: string;
    menuItemId: string;
    menuItemPrice: number;
}
