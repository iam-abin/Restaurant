import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';
import { IUserDocument } from '../database/models';
import { createSuccessResponse } from '../utils';
import { OtpService, UserService } from '../services';
import {
    IOtpToken,
    IPassword,
    ISignin,
    ISignup,
    IUser,
    CustomCookieOptions,
    IGoogleAuthCredential,
    TokenType,
    ISigninData,
    ISignupData,
    IOtpTokenData,
} from '../types';
import { appConfig } from '../config/app-config';
import { HTTP_STATUS_CODE } from '../constants';

@autoInjectable()
export class AuthController {
    constructor(
        // AuthController depends on UserService(So here we inject UserService to AuthController),
        // but doesn't create it(doesn't create instance of it)
        private readonly userService: UserService,
        private readonly otpService: OtpService,
    ) {}

    public signup = async (req: Request, res: Response): Promise<void> => {
        const signupData: ISignupData | null = await this.userService.signUp(req.body as ISignup);
        res.status(HTTP_STATUS_CODE.CREATED).json(
            createSuccessResponse(
                `An otp is send to ${signupData?.user?.email || 'email'}, Please verify`,
                signupData,
            ),
        );
    };

    public signin = async (req: Request, res: Response): Promise<void> => {
        const { user, jwtAccessToken, jwtRefreshToken }: ISigninData = await this.userService.signIn(
            req.body as ISignin,
        );

        this.setTokenToCookie(res, jwtAccessToken, TokenType.JwtAccessToken);
        this.setTokenToCookie(res, jwtRefreshToken, TokenType.JwtRefreshToken);

        res.status(HTTP_STATUS_CODE.OK).json(createSuccessResponse('Login success', user));
    };

    public googleAuth = async (req: Request, res: Response): Promise<void> => {
        const { user, jwtAccessToken, jwtRefreshToken }: ISigninData = await this.userService.googleAuth(
            req.body as IGoogleAuthCredential,
        );
        this.setTokenToCookie(res, jwtAccessToken, TokenType.JwtAccessToken);
        this.setTokenToCookie(res, jwtRefreshToken, TokenType.JwtRefreshToken);

        res.status(HTTP_STATUS_CODE.OK).json(createSuccessResponse('Login success', user));
    };

    public refresh = async (req: Request, res: Response): Promise<void> => {
        const { jwtRefreshToken } = req.cookies;

        try {
            const { jwtAccessToken }: { jwtAccessToken: string } =
                await this.userService.jwtRefresh(jwtRefreshToken);
            this.setTokenToCookie(res, jwtAccessToken, TokenType.JwtAccessToken);
            res.status(HTTP_STATUS_CODE.OK).json(createSuccessResponse('Token refreshed successfully'));
        } catch (error: unknown) {
            res.clearCookie(TokenType.JwtAccessToken);
            res.clearCookie(TokenType.JwtRefreshToken);
            throw error;
        }
    };

    private setTokenToCookie = async (res: Response, token: string, tokenType: TokenType) => {
        const isAccessToken: boolean = tokenType === TokenType.JwtAccessToken;
        res.cookie(
            isAccessToken ? TokenType.JwtAccessToken : TokenType.JwtRefreshToken,
            token,
            this.getCookieOptions(
                isAccessToken
                    ? appConfig.COOKIE_JWT_ACCESS_EXPIRY_TIME
                    : appConfig.COOKIE_JWT_REFRESH_EXPIRY_TIME,
            ),
        );
    };

    private getCookieOptions = (maxAge: number = 30 * 60 * 1000): CustomCookieOptions => {
        // Default maxAge 30 min
        return {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge,
        };
    };

    public verifyOtp = async (req: Request, res: Response): Promise<void> => {
        const { userId, otp } = req.body as Omit<IOtpToken, 'resetToken'>;
        const user: IUserDocument | null = await this.otpService.verifyOtp(userId, otp);
        res.status(HTTP_STATUS_CODE.OK).json(
            createSuccessResponse('Otp verified successfully, Pleast login', user),
        );
    };

    public resendOtp = async (req: Request, res: Response): Promise<void> => {
        const { userId } = req.body as Pick<IOtpToken, 'userId'>;
        const otpData: IOtpTokenData = await this.otpService.resendOtp(userId);
        res.status(HTTP_STATUS_CODE.OK).json(
            createSuccessResponse(
                `An otp is send to ${otpData?.user?.email || 'your email'}, Please verify`,
                otpData,
            ),
        );
    };

    public forgotPassword = async (req: Request, res: Response): Promise<void> => {
        const { email } = req.body as Pick<IUser, 'email'>;
        const user: IOtpTokenData | null = await this.otpService.forgotPassword(email);
        res.status(HTTP_STATUS_CODE.OK).json(
            createSuccessResponse(`Password reset link sent to ${email}, Please verify`, user),
        );
    };

    public verifyResetToken = async (req: Request, res: Response): Promise<void> => {
        const { resetToken } = req.body as Pick<IOtpToken, 'resetToken'>;
        const user: IUserDocument | null = await this.otpService.verifyResetToken(resetToken);
        res.status(HTTP_STATUS_CODE.OK).json(
            createSuccessResponse('Reset Token verified successfully, Pleast Reset your password', user),
        );
    };

    public resetPassword = async (req: Request, res: Response): Promise<void> => {
        const { userId, password } = req.body as IPassword;
        const user: IUserDocument | null = await this.otpService.resetPassword(userId, password);
        res.status(HTTP_STATUS_CODE.OK).json(createSuccessResponse('Password reseted successfully', user));
    };

    public blockUnblockUser = async (req: Request, res: Response): Promise<void> => {
        const { userId } = req.params;
        const user: IUserDocument | null = await this.userService.updateBlockStatus(userId);
        res.status(HTTP_STATUS_CODE.OK).json(
            createSuccessResponse(`user ${user?.isBlocked ? 'blocked' : 'unBlocked'}  successfully`, user),
        );
    };

    public logout = async (req: Request, res: Response): Promise<void> => {
        res.clearCookie(TokenType.JwtAccessToken);
        res.clearCookie(TokenType.JwtRefreshToken);
        res.status(HTTP_STATUS_CODE.OK).json(createSuccessResponse('Successfully logged out'));
    };
}
