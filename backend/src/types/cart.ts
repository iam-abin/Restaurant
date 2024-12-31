export interface ICart {
    userId: string;
    restaurantId: string;
    itemId: string;
    quantity: number;
}

export type GetCartItemsByRestaurantParams = {
    userId: string;
    restaurantId: string;
    page: number;
    limit: number;
};
