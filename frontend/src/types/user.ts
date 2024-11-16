// import { IUserRole } from './roles';

export interface IUser {
    email: string;
    password: string;
    role: string;
}

export interface ISignup extends IUser {
    name: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ISignin extends IUser {}
