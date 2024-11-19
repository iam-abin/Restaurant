// import { IUserRole } from './roles';

export interface IUser {
    id?: string
    name: string
    email: string
    phone: string
    password: string
    role: string
}

export interface ISignup extends Omit<IUser, 'id'> {
    name: string
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ISignin extends Pick<IUser, 'id' | 'email' | 'password' | 'role'> {}
