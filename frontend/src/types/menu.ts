import { ICuisineResponse1 } from './cuisine';

export interface IMenu {
    _id: string;
    name: string;
    description: string;
    cuisineId: ICuisineResponse1 | string;
    cuisine: string;
    price: number;
    salePrice?: number | undefined;
    imageUrl: string;
    restaurantId: string;
    featured: boolean;
    isClosed: boolean;
}

export type Menus = {
    menus: IMenu[];
    numberOfPages: number;
};
