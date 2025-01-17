import { IOtpResponse } from './otp';
import { UserRole } from './roles';

export interface IUser {
    _id: string;
    name: string;
    email: string;
    phone: string;
    role: UserRole;
    isBlocked: boolean;
    isVerified: boolean;
}

export interface ISignup extends Omit<IUser, '_id' | 'isBlocked' | 'isVerified'> {
    password: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ISignupResponse extends IOtpResponse {}

export interface ISignin extends Pick<IUser, 'email' | 'role'> {
    password: string;
}

export interface IGoogleAuth extends Pick<IUser, 'role'> {
    credential: string;
}
