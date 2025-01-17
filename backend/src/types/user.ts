import { IUserDocument } from '../database/model';
import { IOtpTokenData } from './otp';
import { UserRole } from './roles';

export interface IUser {
    name: string;
    email: string;
    phone?: number;
    password?: string;
    googleId?: string;
    role: UserRole;
    isBlocked: boolean;
    isVerified: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ISignup extends Omit<IUser, 'isBlocked' | 'isVerified'> {}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ISignin extends Pick<IUser, 'email' | 'password' | 'role'> {}

export interface IGoogleAuthCredential extends Pick<IUser, 'role'> {
    credential: string;
}

export interface IGoogleAuth extends Pick<IUser, 'name' | 'email' | 'role' | 'googleId'> {
    imageUrl: string;
}

export type DecodedGoogleToken = {
    sub: string; // User's unique Google ID
    name: string; // Full name
    email: string; // Email address
    picture: string; // URL to the profile picture
    iat: number; // Issued at (timestamp)
    exp: number; // Expiration time (timestamp)
    email_verified: boolean;
};

export interface ISigninData {
    user: IUserDocument;
    jwtAccessToken: string;
    jwtRefreshToken: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ISignupData extends IOtpTokenData {}
