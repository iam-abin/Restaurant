import { IRestaurantResponse } from './restaurant';
import { IUser } from './user';

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

export interface ICheckoutResponse {
    stripePaymentUrl: string;
}

export interface IOrdersResponse extends Omit<IOrder, 'userId' | 'restaurantId' | 'cartId' | 'addressId'> {
    _id: string;
    userId: string | IUser;
    restaurantId: string | IRestaurantResponse;
    addressId: string;
}
