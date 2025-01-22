import { IMenuDocument } from '../database/model';

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
}

export type Menus = {
    menus: IMenuDocument[];
    numberOfPages: number;
};

export type MenuId = {
    menuId: string;
};
