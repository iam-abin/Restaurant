import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { IProfileDocument } from '../database/model';
import { createSuccessResponse } from '../utils';
import { ProfileService } from '../services';
import { IProfilesData, ProfileUpdate } from '../types';

const profileService = container.resolve(ProfileService);

class ProfileController {
    public async getProfile(req: Request, res: Response): Promise<void> {
        const { userId } = req.currentUser!;

        const user: IProfileDocument | null = await profileService.getProfile(userId);
        res.status(200).json(createSuccessResponse('User Profile', user));
    }

    public async getProfiles(req: Request, res: Response): Promise<void> {
        const { page, limit } = req.params;
        const profilesData: IProfilesData = await profileService.getUserProfiles(Number(page), Number(limit));
        res.status(200).json(createSuccessResponse('User Profiles fetched successfully', profilesData));
    }

    public async editProfile(req: Request, res: Response): Promise<void> {
        const { userId } = req.currentUser!;
        const user: IProfileDocument | null = await profileService.updateProfile(
            userId,
            req.body as ProfileUpdate,
        );
        res.status(200).json(createSuccessResponse('Profile updated successfully', user));
    }
}

export const profileController = new ProfileController();
