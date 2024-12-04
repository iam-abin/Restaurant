// import { IUserRole } from "./roles";

export interface IUser {
    _id: string;
    name: string;
    email: string;
    phone: string;
    // role: Partial<IUserRole>;
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
