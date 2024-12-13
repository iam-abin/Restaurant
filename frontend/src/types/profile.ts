import { IUser } from './user';
import { IAddress } from './address';

export interface IProfile {
    _id: string;
    userId: IUser | string;
    addressId: IAddress | string;
    imageUrl: string;
    image?: string;
}

export type ProfileUpdate = Partial<Pick<IProfile, 'image'> & Pick<IUser, 'name'> & Omit<IAddress, 'userId'>>;

export interface IProfilesResponse {
    profiles: IProfile[] | null;
    numberOfPages: number;
}

