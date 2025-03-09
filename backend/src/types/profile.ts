import { IProfileDocument } from '../database/models';
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
    profiles: IProfileDocument[];
    numberOfPages: number;
}

export interface ISearchProfileResult {
    profiles: Pick<IProfileDocument, '_id' | 'imageUrl' | 'userId'>[];
    totalCount: number;
}

export interface ISearchProfileData extends Omit<ISearchProfileResult, 'totalCount'> {
    numberOfPages: number;
}
