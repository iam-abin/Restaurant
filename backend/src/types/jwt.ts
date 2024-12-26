import { IUserRole } from './roles';

export interface IJwtPayload {
    userId: string;
    email: string;
    role: Partial<IUserRole>;
}

export type Tokens = {
    accessToken: string;
    refreshToken: string;
};
