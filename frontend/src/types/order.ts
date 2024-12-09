import { IAddress } from './address';
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

// ==========================
interface OrderItem {
    item: string;
    price: number;
    quantity: number;
    imageUrl: string;
}

export interface IRestaurantOrder {
    _id: string;
    userDetails: Pick<IUser, 'name' | 'email'>;
    address: IAddress;
    status: string;
    createdAt: string;
    orderedItems: OrderItem[];
    totalAmound: number;
}