import mongoose from 'mongoose';
import { IRestaurantCuisineDocument, IRestaurantDocument } from '../database/models';

export interface IRestaurant {
    ownerId: string;
    addressId: string;
    name: string;
    phone: number;
    city: string;
    country: string;
    deliveryTime: number;
    imageUrl?: string;
    cuisines: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IRestaurantUpdate extends Omit<IRestaurant, 'ownerId' | 'addressId' | 'imageUrl'> {}

export interface IRestaurantsData {
    restaurants: IRestaurantDocument[] | null;
    numberOfPages: number;
}

export interface ISearchFilterRestaurantResult {
    imageUrl: string;
    city: string;
    country: string;
    restaurantName: string;
    cuisines: string[];
    _id: mongoose.Schema.Types.ObjectId;
}

export interface IRestaurantResult {
    restaurant: IRestaurantDocument;
    restaurantCuisines: IRestaurantCuisineDocument[];
    restaurantRating: number;
    restaurantRatingsCount: number;
    myRating: number;
    cartItemsCount: number;
}

export interface IRestaurantResponse {
    _id: string; // Restaurant ID
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
    deliveryTime: number; // Delivery time in minutes (or other unit)
    imageUrl: string; // Image URL for the restaurant
}

export type SearchRestaurant = {
    searchText: string;
    searchQuery: string;
    selectedCuisines: string;
    page: number;
    limit: number;
};

export type SearchFilterResult = {
    restaurants: ISearchFilterRestaurantResult[];
    totalCount: number;
};

export type SearchFilterData = Omit<SearchFilterResult, 'totalCount'> & {
    numberOfPages: number;
};

// For admin
export interface ISearchRestaurantResult {
    restaurants: Pick<IRestaurantDocument, '_id' | 'imageUrl' | 'ownerId'>[];
    totalCount: number;
}

// For admin
export interface ISearchRestaurantData extends Omit<ISearchRestaurantResult, 'totalCount'> {
    numberOfPages: number;
}

export interface IRestaurantWithCuisines {
    restaurant: IRestaurantDocument | null;
    cuisines: IRestaurantCuisineDocument[];
    restaurantRating: number;
    restaurantRatingsCount: number;
}

export type RestaurantId = {
    restaurantId: string;
};
