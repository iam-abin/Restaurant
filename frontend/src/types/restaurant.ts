import { IAddress } from "./address";
import { IUser } from "./user";

export interface IRestaurant {
    id?: string
    ownerId: IUser;
    addressId: IAddress;
    restaurantName: IRestaurant;
    city: string;
    country: string;
    deliveryTime: number;
    imageUrl: string;
    image?: File
    cuisines: any
}
