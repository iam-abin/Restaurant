export interface IMenu {
    name: string;
    description: string;
    price: number;
    salePrice: number;
    imageUrl: string;
    cuisine: string;
    cuisineId?: string;
    restaurantId: string;
}
