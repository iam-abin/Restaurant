import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';
import { IProfileDocument } from '../database/model';
import { createSuccessResponse } from '../utils';
import { ProfileService } from '../services';
import { IProfilesData, ProfileUpdate } from '../types';

@autoInjectable()
export class ProfileController {
    constructor(private readonly profileService: ProfileService) {}

    public async getProfile(req: Request, res: Response): Promise<void> {
        const { userId } = req.currentUser!;

        const user: IProfileDocument | null = await this.profileService.getProfile(userId);
        res.status(200).json(createSuccessResponse('User Profile', user));
    }

    public async getProfiles(req: Request, res: Response): Promise<void> {
        const { page = 1, limit = 10 } = req.query;
        const profilesData: IProfilesData = await this.profileService.getUserProfiles(
            page as number,
            limit as number,
        );
        res.status(200).json(createSuccessResponse('User Profiles fetched successfully', profilesData));
    }

    public async editProfile(req: Request, res: Response): Promise<void> {
        const { userId } = req.currentUser!;
        const user: IProfileDocument | null = await this.profileService.updateProfile(
            userId,
            req.body as ProfileUpdate,
        );
        res.status(200).json(createSuccessResponse('Profile updated successfully', user));
    }
}
