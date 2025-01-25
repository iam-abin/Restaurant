import { UserRole } from './roles';

export interface IJwtPayload {
    userId: string;
    role: UserRole;
}

// Enum for token types
export enum TokenType {
    JwtAccessToken = 'jwtAccessToken',
    JwtRefreshToken = 'jwtRefreshToken',
}

// Type for Tokens
export type Tokens = {
    [TokenType.JwtAccessToken]: string;
    [TokenType.JwtRefreshToken]: string;
};
