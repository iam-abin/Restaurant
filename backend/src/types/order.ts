export interface IOrder {
    userId: string;
    restaurantId: string;
    cartId: string;
    addressId: string,
    totalAmound: number;
    status: 'pending' | 'confirmed' | 'preparing' | 'outfordelivery' | 'delivered';
}
