export interface IRestaurant {
    ownerId: string;
    addressId: string;
    name: string;
    city: string;
    country: string;
    deliveryTime: number;
    imageUrl: string;
    cuisines: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IRestaurantUpdate extends Omit<IRestaurant, 'ownerId' | 'addressId' | 'imageUrl'> {}
