interface UserDto {
    email: string;
    password: string;
}

export type UserSignInDto = UserDto;

export interface UserSignupDto extends UserDto {
    name: string;
}
