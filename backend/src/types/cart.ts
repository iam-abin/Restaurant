import { ClientSession } from 'mongoose';
import { ICartDocument } from '../database/models';
import { Pagination } from './pagination';

export interface ICart {
    userId: string;
    restaurantId: string;
    itemId: string;
    quantity: number;
}

export type GetCartItemsByRestaurantIdParams = Required<Pagination> & {
    userId: string;
    restaurantId: string;
};

export interface IFindCartItemsByRestaurant extends Pagination {
    userId: string;
    restaurantId: string;
    skip?: number;
    session?: ClientSession;
}

export type CartItemId = {
    cartItemId: string;
};

export type Quantity = {
    quantity: number;
};

export interface ICartItemsData {
    cartItems: ICartDocument[];
    numberOfPages: number;
}
