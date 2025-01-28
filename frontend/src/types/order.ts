import { IAddress } from './address';
import { IRestaurantResponse } from './restaurant';
import { IUser } from './user';

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'outfordelivery' | 'delivered';

export interface IOrder {
    userId: string;
    restaurantId: string;
    addressId: string;
    totalAmount: number;
    status: OrderStatus;
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

export interface OrderItem {
    name: string;
    price: number;
    quantity: number;
    imageUrl: string;
}

export interface IRestaurantOrder {
    _id: string;
    userDetails: Pick<IUser, 'name' | 'email'>;
    restaurantDetails: Pick<IUser, 'name' | 'email'>;
    address: IAddress;
    status: OrderStatus;
    createdAt: string;
    orderedItems: OrderItem[];
    totalAmount: number;
}

export type Orders = {
    orders: IRestaurantOrder[];
    numberOfPages: number;
};
