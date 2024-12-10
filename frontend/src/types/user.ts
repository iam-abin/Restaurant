// import { IUserRole } from "./roles";

export interface IUser {
    _id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    isBlocked: boolean;
    isVerified: boolean;
}

export interface ISignup extends Omit<IUser, '_id' | 'isBlocked' | 'isVerified'> {
    password: string;
}

export interface ISignin extends Pick<IUser, 'email' | 'role'> {
    password: string;
}

export interface IGoogleAuth extends Pick<IUser, 'name' | 'email' | 'role'> {
    picture: string;
    imageUrl: string;
    googleId: string;
}

export type DecodedGoogleToken = {
    sub: string; // User's unique Google ID
    name: string; // Full name
    email: string; // Email address
    picture: string; // URL to the profile picture
    iat: number; // Issued at (timestamp)
    exp: number; // Expiration time (timestamp)
};
