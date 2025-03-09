import { IMenuDocument } from '../database/models';

export interface IMenu {
    name: string;
    description: string;
    price: number;
    salePrice: number;
    imageUrl: string;
    cuisine: string;
    cuisineId?: string;
    featured: boolean;
    restaurantId: string;
    isClosed: boolean;
}

export type Menu = {
    menu: IMenuDocument[];
    numberOfPages: number;
};

export type MenuId = {
    menuItemId: string;
};
