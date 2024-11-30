import { IAddress } from './address';
import { ICuisine, ICuisineResponse } from './cuisine';
import { IUser } from './user';

export interface IRestaurant {
    _id?: string;
    ownerId: IUser;
    addressId: IAddress;
    city: string;
    country: string;
    deliveryTime: number;
    imageUrl: string;
    image?: File;
    cuisines: ICuisine[];
}

export interface IRestaurantResponse {
    _id: string;
    restaurant: IRestaurant;
    cuisines: ICuisineResponse[];
}

export interface ISearchResult {
    _id: string;
    imageUrl: string;
    city: string;
    country: string;
    restaurantName: string;
    cuisines: string[];
}
