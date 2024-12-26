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

export interface IGoogleAuth extends Pick<IUser, 'role'> {
    credential: string;
}

