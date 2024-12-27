import { UserRole } from './roles';

export interface IJwtPayload {
    userId: string;
    email: string;
    role: UserRole;
}

export type Tokens = {
    accessToken: string;
    refreshToken: string;
};
