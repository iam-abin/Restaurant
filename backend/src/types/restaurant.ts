import mongoose from 'mongoose';

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

export interface ISearchResult {
    imageUrl: string;
    city: string;
    country: string;
    restaurantName: string;
    cuisines: string[];
    _id: mongoose.Schema.Types.ObjectId;
}

export interface IRestaurantResponse {
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
