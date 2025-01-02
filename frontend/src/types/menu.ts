export interface IMenu {
    _id: string;
    name: string;
    description: string;
    cuisine: string;
    price: number;
    salePrice?: number | undefined;
    imageUrl: string;
    restaurantId: string;
    isClosed: boolean;
}

export type Menus = {
    menus: IMenu[];
    numberOfPages: number;
};
