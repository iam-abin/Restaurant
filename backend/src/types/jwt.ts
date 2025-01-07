import { UserRole } from './roles';

export interface IJwtPayload {
    userId: string;
    email: string;
    role: UserRole;
}

// export enum Tokens {
//     JwtAccessToken = 'jwtAccessToken',
//     JwtRefreshToken = 'jwtRefreshToken'
// };

export type Tokens = {
    jwtAccessToken: string;
    jwtRefreshToken: string;
};