import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { UserService } from '../services';
import { UserSignInDto, UserSignupDto } from '../dto/auth.dto';
import { IUser } from '../database/model';
import createSuccessResponse from '../utils/response';
import { OtpService } from '../services';
import { OtpDto } from '../dto/otp.dto';

const userService = container.resolve(UserService);
const otpService = container.resolve(OtpService);

class UserController {
    public async signup(req: Request, res: Response): Promise<void> {
        const user: IUser | null = await userService.signUp(req.body as UserSignupDto);
        res.status(201).json(createSuccessResponse('An otp is send to your email. Pleas verify', user));
    }

    public async signin(req: Request, res: Response): Promise<void> {
        const user: { user: IUser; accessToken: string } = await userService.signIn(
            req.body as UserSignInDto,
        );
        res.status(200).json(createSuccessResponse('Login success', user));
    }

    public async verifyOtp(req: Request, res: Response): Promise<void> {
        const { userId, otp } = req.body as OtpDto;
        const user: IUser | null = await otpService.verify(userId, otp);
        res.status(200).json(createSuccessResponse('Otp verified successfully, Pleast login', user));
    }

    public async resendOtp(req: Request, res: Response): Promise<void> {
        const { userId } = req.body;
        const user: IUser | null = await otpService.resendOtp(userId);
        res.status(200).json(createSuccessResponse('An otp is send to your emain, Please verify', user));
    }

    public async profile(req: Request, res: Response): Promise<void> {
        const { userId } = req.user!;
        const user: IUser | null = await userService.getProfile(userId);
        res.status(200).json(createSuccessResponse('User Profile', user));
    }
}

export const userController = new UserController();
