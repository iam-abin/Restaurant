import { IAddress } from './address';
import { ICuisine, ICuisineResponse, ICuisineResponse1 } from './cuisine';
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

export interface IRestaurantCard {
    _id: string;
    restaurantName: string;
    imageUrl: string;
    city: string;
    country: string;
    cuisines: string[];
}

export interface IRestaurantsResponse {
    restaurants: IRestaurant[] | null;
    numberOfPages: number;
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

export interface IRestaurantResult {
    restaurant: IRestaurantResponse2;
    restaurantCuisines: {cuisineId: ICuisineResponse1}[];
    restaurantRating: number;
    restaurantRatingsCount: number;
    myRating: number;
    cartItemsCount: number;
}

export interface IRestaurantResponse2 {
    _id: string; // Restaurant ID (MongoDB ObjectId as string)
    ownerId: Omit<IUser, 'role' | 'isBlocked' | 'isVerified'> | null;
    deliveryTime: number; // Delivery time in minutes (or other unit)
    addressId: IAddress | null;
    imageUrl: string; // Image URL for the restaurant
}

export type SearchResponse = {
    restaurants: ISearchResult[];
    numberOfPages: number;
};
