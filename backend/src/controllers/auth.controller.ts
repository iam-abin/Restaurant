import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { IUserDocument } from '../database/model';
import { isProduction, createSuccessResponse, JWT_KEYS_CONSTANTS } from '../utils';
import { OtpService, UserService } from '../services';
import {
    IOtpToken,
    IPassword,
    ISignin,
    ISignup,
    IUser,
    CustomCookieOptions,
    IGoogleAuthCredential,
} from '../types';
import { appConfig } from '../config/app.config';

const userService = container.resolve(UserService);
const otpService = container.resolve(OtpService);

class AuthController {
    public async signup(req: Request, res: Response): Promise<void> {
        const user: IUserDocument | null = await userService.signUp(req.body as ISignup);
        res.status(201).json(
            createSuccessResponse(`An otp is send to ${user?.email || 'email'}, Please verify`, user),
        );
    }

    public signin = async (req: Request, res: Response): Promise<void> => {
        const { user, accessToken, refreshToken } = await userService.signIn(req.body as ISignin);

        res.cookie(
            JWT_KEYS_CONSTANTS.JWT_TOKEN,
            accessToken,
            this.getCookieOptions(appConfig.COOKIE_JWT_ACCESS_EXPIRY_TIME),
        );
        res.cookie(
            JWT_KEYS_CONSTANTS.JWT_REFRESH_TOKEN,
            refreshToken,
            this.getCookieOptions(appConfig.COOKIE_JWT_REFRESH_EXPIRY_TIME),
        );

        res.status(200).json(createSuccessResponse('Login success', user));
    };

    public googleAuth = async (req: Request, res: Response): Promise<void> => {
        await userService.googleAuth(req.body as IGoogleAuthCredential);
        // res.cookie(
        //     JWT_KEYS_CONSTANTS.JWT_TOKEN,
        //     accessToken,
        //     this.getCookieOptions(appConfig.COOKIE_JWT_ACCESS_EXPIRY_TIME),
        // );
        // res.cookie(
        //     JWT_KEYS_CONSTANTS.JWT_REFRESH_TOKEN,
        //     refreshToken,
        //     this.getCookieOptions(appConfig.COOKIE_JWT_REFRESH_EXPIRY_TIME),
        // );

        // res.status(200).json(createSuccessResponse('Login success', user));
    };

    public refresh = async (req: Request, res: Response): Promise<void> => {
        const { jwtRefreshToken } = req.cookies;

        try {
            const { accessToken }: { accessToken: string } = await userService.jwtRefresh(jwtRefreshToken);
            res.cookie(
                JWT_KEYS_CONSTANTS.JWT_TOKEN,
                accessToken,
                this.getCookieOptions(appConfig.COOKIE_JWT_ACCESS_EXPIRY_TIME),
            );
            res.status(200).json(createSuccessResponse('Token refreshed successfully'));
        } catch {
            res.clearCookie(JWT_KEYS_CONSTANTS.JWT_TOKEN);
            res.clearCookie(JWT_KEYS_CONSTANTS.JWT_REFRESH_TOKEN);
            res.status(400).json('Token refresh failed');
        }
    };

    private getCookieOptions(maxAge: number = 30 * 60 * 1000): CustomCookieOptions {
        // Default maxAge 30 min
        return {
            httpOnly: true,
            secure: isProduction(),
            sameSite: 'lax',
            maxAge,
        };
    }

    public async verifyOtp(req: Request, res: Response): Promise<void> {
        const { userId, otp } = req.body as Omit<IOtpToken, 'resetToken'>;
        const user: IUserDocument | null = await otpService.verifyOtp(userId, otp);
        res.status(200).json(createSuccessResponse('Otp verified successfully, Pleast login', user));
    }

    public async resendOtp(req: Request, res: Response): Promise<void> {
        const { userId } = req.body as Pick<IOtpToken, 'userId'>;
        const user: IUserDocument | null = await otpService.resendOtp(userId);
        res.status(200).json(
            createSuccessResponse(`An otp is send to ${user?.email || 'your email'}, Please verify`, user),
        );
    }

    public async forgotPassword(req: Request, res: Response): Promise<void> {
        const { email } = req.body as Pick<IUser, 'email'>;
        const user: IUserDocument | null = await otpService.forgotPassword(email);
        res.status(200).json(
            createSuccessResponse(`Password reset link sent to ${email}, Please verify`, user),
        );
    }

    public async verifyResetToken(req: Request, res: Response): Promise<void> {
        const { resetToken } = req.body as Pick<IOtpToken, 'resetToken'>;
        const user: IUserDocument | null = await otpService.verifyResetToken(resetToken);
        res.status(200).json(
            createSuccessResponse('Reset Token verified successfully, Pleast Reset your password', user),
        );
    }

    public async resetPassword(req: Request, res: Response): Promise<void> {
        const { userId, password } = req.body as IPassword;
        const user: IUserDocument | null = await otpService.resetPassword(userId, password);
        res.status(200).json(createSuccessResponse('Password reseted successfully', user));
    }

    public async blockUnblockUser(req: Request, res: Response): Promise<void> {
        const { userId } = req.params;
        const user: IUserDocument | null = await userService.updateBlockStatus(userId);
        res.status(200).json(
            createSuccessResponse(
                `candidate ${user?.isBlocked ? 'blocked' : 'unBlocked'}  successfully`,
                user,
            ),
        );
    }

    public async logout(req: Request, res: Response): Promise<void> {
        res.clearCookie(JWT_KEYS_CONSTANTS.JWT_TOKEN);
        res.clearCookie(JWT_KEYS_CONSTANTS.JWT_REFRESH_TOKEN);
        res.status(200).json(createSuccessResponse('Successfully logged out'));
    }
}

export const authController = new AuthController();
