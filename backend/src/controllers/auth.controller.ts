import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { IUserDocument } from '../database/model';

import { createSuccessResponse, JWT_KEYS_CONSTANTS } from '../utils';
import { OtpService, UserService } from '../services';
import { IGoogleAuth, IOtpToken, IPassword, ISignin, ISignup, IUser } from '../types';

const userService = container.resolve(UserService);
const otpService = container.resolve(OtpService);

class AuthController {
    public async signup(req: Request, res: Response): Promise<void> {
        const user: IUserDocument | null = await userService.signUp(req.body as ISignup);
        res.status(201).json(
            createSuccessResponse(`An otp is send to ${user?.email || 'email'}, Please verify`, user),
        );
    }

    public async signin(req: Request, res: Response): Promise<void> {
        const { user, accessToken, refreshToken } = await userService.signIn(req.body as ISignin);
        res.cookie(JWT_KEYS_CONSTANTS.JWT_TOKEN, accessToken);
        res.status(200).json(createSuccessResponse('Login success', user));
    }

    public async googleAuth(req: Request, res: Response): Promise<void> {
        const { user, accessToken, refreshToken } = await userService.googleAuth(req.body as IGoogleAuth);
        res.cookie(JWT_KEYS_CONSTANTS.JWT_TOKEN, accessToken);
        res.status(200).json(createSuccessResponse('Login success', user));
    }

    public async refresh(req: Request, res: Response): Promise<void> {
        const { refreshToken } = req.body;
        const { accessToken }: { accessToken: string } = await userService.jwtRefresh(refreshToken);
        res.cookie(JWT_KEYS_CONSTANTS.JWT_TOKEN, accessToken);
        res.status(200).json(createSuccessResponse('Token refreshed successfully'));
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
        res.status(200).json(createSuccessResponse(`Password reseted successfully`, user));
    }

    public async blockUnblockUser(req: Request, res: Response): Promise<void> {
        const { userId } = req.params;
        const user: IUserDocument | null = await userService.blockUnblockUser(userId);
        res.status(200).json(
            createSuccessResponse(
                `candidate ${user?.isBlocked ? 'blocked' : 'unBlocked'}  successfully`,
                user,
            ),
        );
    }

    public async logout(req: Request, res: Response): Promise<void> {
        res.clearCookie(JWT_KEYS_CONSTANTS.JWT_TOKEN);
        res.status(200).json(createSuccessResponse('Successfully logged out'));
    }
}

export const authController = new AuthController();
