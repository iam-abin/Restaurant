import { ICartDocument } from '../database/model';

export interface ICart {
    userId: string;
    restaurantId: string;
    itemId: string;
    quantity: number;
}

export type GetCartItemsByRestaurantIdParams = {
    userId: string;
    restaurantId: string;
    page: number;
    limit: number;
};

export interface ICartItemsData {
    cartItems: ICartDocument[];
    numberOfPages: number;
}
