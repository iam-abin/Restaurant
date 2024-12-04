import { IMenu } from './menu';

export interface ICart {
    _id: string;
    userId: string;
    restaurantId: string;
    itemId: IMenu;
    quantity: number;
}
