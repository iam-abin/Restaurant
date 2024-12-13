import { IProfileDocument } from '../database/model';
import { IAddress } from './address';
import { IUser } from './user';

export interface IProfile {
    userId: string;
    addressId: string;
    image: string;
    imageUrl?: string;
}

export type ProfileUpdate = Partial<Pick<IProfile, 'image'> & Pick<IUser, 'name'> & Omit<IAddress, 'userId'>>;

export interface IProfilesData {
    profiles: IProfileDocument[] | null;
    numberOfPages: number;
}
