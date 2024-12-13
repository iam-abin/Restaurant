import { IUserRole } from './roles';

export interface IUser {
    name: string;
    email: string;
    phone?: number;
    password?: string;
    googleId?: string;
    role: Partial<IUserRole>;
    isBlocked: boolean;
    isVerified: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ISignup extends Omit<IUser, 'isBlocked' | 'isVerified'> {}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ISignin extends Pick<IUser, 'email' | 'password' | 'role'> {}

export interface IGoogleAuth extends Pick<IUser, 'name' | 'email' | 'role' | 'googleId'> {
    imageUrl: string;
}
