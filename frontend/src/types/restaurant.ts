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
