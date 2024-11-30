type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'outfordelivery' | 'delivered';

export interface IOrder {
    userId: string;
    restaurantId: string;
    addressId: string;
    totalAmound: number;
    status: OrderStatus;
}

export interface IOrderedItem {
    userId: string;
    orderId: string;
    menuItemId: string;
    menuItemPrice: number;
}
