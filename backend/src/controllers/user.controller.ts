import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { IUserDocument } from '../database/model';

import { createSuccessResponse, JWT_KEYS } from '../utils';
import { OtpService, UserService } from '../services';
import { IOtp, ISignin, ISignup } from '../types';

const userService = container.resolve(UserService);
const otpService = container.resolve(OtpService);

class UserController {
    public async signup(req: Request, res: Response): Promise<void> {
        const user: IUserDocument | null = await userService.signUp(req.body as ISignup);
        res.status(201).json(createSuccessResponse('An otp is send to your email. Pleas verify', user));
    }

    public async signin(req: Request, res: Response): Promise<void> {
        const user: { user: ISignin; accessToken: string } = await userService.signIn(req.body as ISignin);
        res.cookie(JWT_KEYS.JWT_TOKEN, user.accessToken);
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
        res.status(200).json(createSuccessResponse('An otp is send to your email, Please verify', user));
    }

    public async profile(req: Request, res: Response): Promise<void> {
        const { userId } = req.currentUser!;
        const user: IUserDocument | null = await userService.getProfile(userId);
        res.status(200).json(createSuccessResponse('User Profile', user));
    }

    public async logout(req: Request, res: Response): Promise<void> {
        res.clearCookie(JWT_KEYS.JWT_TOKEN);
        res.status(200).json(createSuccessResponse('Successfully logged out'));
    }
}

export const userController = new UserController();
