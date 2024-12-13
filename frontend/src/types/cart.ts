import { IMenu } from './menu';
import { IRestaurant } from './restaurant';
import { IUser } from './user';

export interface ICart {
    _id: string;
    userId: string;
    restaurantId: string;
    itemId: IMenu;
    quantity: number;
}

export interface ICartQuantityUpdate {
    cartItemId: string;
    quantity: number;
}

export interface ICartResponse {
    _id: string;
    userId: string | IUser;
    itemId: string | IMenu;
    restaurantId: string | IRestaurant;
    quantity: number;
}
