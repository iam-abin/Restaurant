import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { IProfileDocument } from '../database/model';

import { createSuccessResponse } from '../utils';
import { ProfileService } from '../services';
import { IProfile, IUser } from '../types';

const profileService = container.resolve(ProfileService);

class ProfileController {
    public async getProfile(req: Request, res: Response): Promise<void> {
        const { userId } = req.currentUser!;

        const user: IProfileDocument | null = await profileService.getProfile(userId);
        res.status(200).json(createSuccessResponse('User Profile', user));
    }

    public async editProfile(req: Request, res: Response): Promise<void> {
        const { userId } = req.currentUser!;
        const user: IProfileDocument | null = await profileService.updateProfile(
            userId,
            req.body as Partial<IProfile & IUser>,
        );
        res.status(200).json(createSuccessResponse('User Profile', user));
    }
}

export const profileController = new ProfileController();
