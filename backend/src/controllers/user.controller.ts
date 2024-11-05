import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { UserService } from '../services';
import { UserSignInDto, UserSignupDto } from '../dto/auth.dto';
import { IUser } from '../database/model';
import createSuccessResponse from '../utils/response';

const userService = container.resolve(UserService);

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

}

export const userController = new UserController();
