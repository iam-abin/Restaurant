import { IOrderDocument } from '../database/model';
import { Pagination } from './pagination';

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

export type GetRestaurantOrders = Required<Pagination> & {
    ownerId: string;
    restaurantId: string;
};

export interface IStripeLintItems {
    price_data: {
        currency: string;
        product_data: {
            name: string;
            images: string[];
        };
        unit_amount: number;
    };
    quantity: number;
}
