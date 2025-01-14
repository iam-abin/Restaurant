import { IOrderDocument } from '../database/model';

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'outfordelivery' | 'delivered';

export interface IOrder {
    userId: string;
    restaurantId: string;
    addressId: string;
    totalAmount: number;
    status: OrderStatus;
}

export type Orders = {
    orders: IOrderDocument[];
    numberOfPages: number;
};

export interface IOrderedItem {
    userId: string;
    orderId: string;
    restaurantId: string;
    menuItemId: string;
    menuItemPrice: number;
    quantity: number;
}

export type GetRestaurantOrders = {
    ownerId: string;
    restaurantId: string;
    page: number;
    limit: number;
};
