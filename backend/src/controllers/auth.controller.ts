import { Request, Response } from 'express';
import { IUserDocument } from '../database/model';
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
} from '../types';
import { appConfig } from '../config/app.config';
import { autoInjectable } from 'tsyringe';

@autoInjectable()
export class AuthController {
    constructor(
        // AuthController depends on UserService(So here we inject UserService to AuthController),
        // but doesn't create it(doesn't create instance of it)
        private readonly userService: UserService,
        private readonly otpService: OtpService,
    ) {}
    public async signup(req: Request, res: Response): Promise<void> {
        const user: IUserDocument | null = await this.userService.signUp(req.body as ISignup);
        res.status(201).json(
            createSuccessResponse(`An otp is send to ${user?.email || 'email'}, Please verify`, user),
        );
    }

    public signin = async (req: Request, res: Response): Promise<void> => {
        const { user, jwtAccessToken, jwtRefreshToken } = await this.userService.signIn(req.body as ISignin);

        this.setTokenToCookie(res, jwtAccessToken, TokenType.JwtAccessToken);
        this.setTokenToCookie(res, jwtRefreshToken, TokenType.JwtRefreshToken);

        res.status(200).json(createSuccessResponse('Login success', user));
    };

    public googleAuth = async (req: Request, res: Response): Promise<void> => {
        const { user, jwtAccessToken, jwtRefreshToken } = await this.userService.googleAuth(
            req.body as IGoogleAuthCredential,
        );
        this.setTokenToCookie(res, jwtAccessToken, TokenType.JwtAccessToken);
        this.setTokenToCookie(res, jwtRefreshToken, TokenType.JwtRefreshToken);

        res.status(200).json(createSuccessResponse('Login success', user));
    };

    public refresh = async (req: Request, res: Response): Promise<void> => {
        const { jwtRefreshToken } = req.cookies;

        try {
            const { jwtAccessToken }: { jwtAccessToken: string } =
                await this.userService.jwtRefresh(jwtRefreshToken);
            this.setTokenToCookie(res, jwtAccessToken, TokenType.JwtAccessToken);
            res.status(200).json(createSuccessResponse('Token refreshed successfully'));
        } catch {
            res.clearCookie(TokenType.JwtAccessToken);
            res.clearCookie(TokenType.JwtRefreshToken);
            res.status(400).json('Token refresh failed');
        }
    };

    private setTokenToCookie(res: Response, token: string, tokenType: TokenType) {
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
    }

    private getCookieOptions(maxAge: number = 30 * 60 * 1000): CustomCookieOptions {
        // Default maxAge 30 min
        return {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge,
        };
    }

    public async verifyOtp(req: Request, res: Response): Promise<void> {
        const { userId, otp } = req.body as Omit<IOtpToken, 'resetToken'>;
        const user: IUserDocument | null = await this.otpService.verifyOtp(userId, otp);
        res.status(200).json(createSuccessResponse('Otp verified successfully, Pleast login', user));
    }

    public async resendOtp(req: Request, res: Response): Promise<void> {
        const { userId } = req.body as Pick<IOtpToken, 'userId'>;
        const user: IUserDocument | null = await this.otpService.resendOtp(userId);
        res.status(200).json(
            createSuccessResponse(`An otp is send to ${user?.email || 'your email'}, Please verify`, user),
        );
    }

    public async forgotPassword(req: Request, res: Response): Promise<void> {
        const { email } = req.body as Pick<IUser, 'email'>;
        const user: IUserDocument | null = await this.otpService.forgotPassword(email);
        res.status(200).json(
            createSuccessResponse(`Password reset link sent to ${email}, Please verify`, user),
        );
    }

    public async verifyResetToken(req: Request, res: Response): Promise<void> {
        const { resetToken } = req.body as Pick<IOtpToken, 'resetToken'>;
        const user: IUserDocument | null = await this.otpService.verifyResetToken(resetToken);
        res.status(200).json(
            createSuccessResponse('Reset Token verified successfully, Pleast Reset your password', user),
        );
    }

    public async resetPassword(req: Request, res: Response): Promise<void> {
        const { userId, password } = req.body as IPassword;
        const user: IUserDocument | null = await this.otpService.resetPassword(userId, password);
        res.status(200).json(createSuccessResponse('Password reseted successfully', user));
    }

    public async blockUnblockUser(req: Request, res: Response): Promise<void> {
        const { userId } = req.params;
        const user: IUserDocument | null = await this.userService.updateBlockStatus(userId);
        res.status(200).json(
            createSuccessResponse(`user ${user?.isBlocked ? 'blocked' : 'unBlocked'}  successfully`, user),
        );
    }

    public async logout(req: Request, res: Response): Promise<void> {
        res.clearCookie(TokenType.JwtAccessToken);
        res.clearCookie(TokenType.JwtRefreshToken);
        res.status(200).json(createSuccessResponse('Successfully logged out'));
    }
}
