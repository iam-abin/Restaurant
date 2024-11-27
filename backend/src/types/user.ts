import { IUserRole } from './roles';

export interface IUser {
    name: string;
    email: string;
    phone: number;
    password: string;
    role: Partial<IUserRole>;
    isBlocked: boolean;
    isVerified: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ISignup extends IUser {}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ISignin extends Omit<IUser, 'name' | 'phone'> {}
