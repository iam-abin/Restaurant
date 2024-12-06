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

export interface IRestaurantCard {
    _id: string;
    restaurantName: string;
    imageUrl: string;
    city: string;
    country: string;
    cuisines: string[];
}

// "https://res.cloudinary.com/dwpugg2gl/image/upload/v1731905882/restaurant_app_images/f0zqroxh9fgf5dq8iiw8.png"
// restaurantName
// :
// "abinv273"
// _id
// :
// "673aa6ff642fdce5257979c6"

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

export interface IRestaurantResponse2 {
    _id: string; // Restaurant ID (MongoDB ObjectId as string)
    name: string; // Restaurant name
    owner: {
        _id: string; // Owner/User ID
        name: string; // Owner/User name
        email: string; // Owner/User email
    } | null; // Owner/User details (nullable because of `preserveNullAndEmptyArrays`)
    address: {
        _id: string; // Address ID
        street: string; // Example field, adapt based on your Address schema
        city: string;
        state: string;
        country: string;
    } | null; // Address details (nullable because of `preserveNullAndEmptyArrays`)
    menus: Array<{
        _id: string; // Menu item ID
        name: string; // Menu item name
        price: number; // Menu item price
        description: string; // Menu item description
    }>; // List of menu items
    cuisines: Array<{
        _id: string; // Cuisine ID
        name: string; // Cuisine name
    }>; // List of cuisines
    deliveryTime: number; // Delivery time in minutes (or other unit)
    imageUrl: string; // Image URL for the restaurant
}
