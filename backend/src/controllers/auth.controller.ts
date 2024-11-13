import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { IUserDocument } from '../database/model';

import { createSuccessResponse, JWT_KEYS_CONSTANTS } from '../utils';
import { OtpService, UserService } from '../services';
import { IOtp, ISignin, ISignup } from '../types';

const userService = container.resolve(UserService);
const otpService = container.resolve(OtpService);

class AuthController {
    public async signup(req: Request, res: Response): Promise<void> {
        const user: IUserDocument | null = await userService.signUp(req.body as ISignup);
        res.status(201).json(
            createSuccessResponse(`An otp is send to your ${user?.email || 'email'}, Please verify`, user),
        );
    }

    public async signin(req: Request, res: Response): Promise<void> {
        const user: { user: ISignin; accessToken: string } = await userService.signIn(req.body as ISignin);
        res.cookie(JWT_KEYS_CONSTANTS.JWT_TOKEN, user.accessToken);
        res.status(200).json(createSuccessResponse('Login success', user));
    }

    public async verifyOtp(req: Request, res: Response): Promise<void> {
        const { userId, otp } = req.body as IOtp;
        const user: IUserDocument | null = await otpService.verify(userId, otp);
        res.status(200).json(createSuccessResponse('Otp verified successfully, Pleast login', user));
    }

    public async resendOtp(req: Request, res: Response): Promise<void> {
        const { userId } = req.body;
        const user: IUserDocument | null = await otpService.resendOtp(userId);
        res.status(200).json(
            createSuccessResponse(`An otp is send to your ${user?.email || 'email'}, Please verify`, user),
        );
    }

    public async forgotPassword(req: Request, res: Response): Promise<void> {
        const { email } = req.body;
        const user: IUserDocument | null = await otpService.forgotPassword(email);
        res.status(200).json(
            createSuccessResponse(`Password reset link sent to your ${email}, Please verify`, user),
        );
    }

    public async resetPassword(req: Request, res: Response): Promise<void> {
        const { email, password, resetToken } = req.body;
        const user: IUserDocument | null = await otpService.resetPassword(email, password, resetToken);
        res.status(200).json(createSuccessResponse(`Password reseted successfully`, user));
    }

    public async logout(req: Request, res: Response): Promise<void> {
        res.clearCookie(JWT_KEYS_CONSTANTS.JWT_TOKEN);
        res.status(200).json(createSuccessResponse('Successfully logged out'));
    }
}

export const authController = new AuthController();
