import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';
import { IProfileDocument } from '../database/model';
import { createSuccessResponse } from '../utils';
import { ProfileService } from '../services';
import {
    IJwtPayload,
    IProfilesData,
    ISearchProfileData,
    Pagination,
    ProfileUpdate,
    SearchQueryParams,
} from '../types';
import { DEFAULT_LIMIT_VALUE, DEFAULT_PAGE_VALUE, HTTP_STATUS_CODE } from '../constants';

@autoInjectable()
export class ProfileController {
    constructor(private readonly profileService: ProfileService) {}

    public getProfile = async (req: Request, res: Response): Promise<void> => {
        const { userId } = req.currentUser as IJwtPayload;
        const user: IProfileDocument | null = await this.profileService.getProfile(userId);
        res.status(HTTP_STATUS_CODE.OK).json(createSuccessResponse('User Profile', user));
    };

    public getProfiles = async (req: Request, res: Response): Promise<void> => {
        const { page = DEFAULT_PAGE_VALUE, limit = DEFAULT_LIMIT_VALUE } = req.query as Pagination;
        const profilesData: IProfilesData = await this.profileService.getUserProfiles(
            page as number,
            limit as number,
        );
        res.status(HTTP_STATUS_CODE.OK).json(
            createSuccessResponse('User Profiles fetched successfully', profilesData),
        );
    };

    public searchProfile = async (req: Request, res: Response): Promise<void> => {
        const {
            searchText,
            page = DEFAULT_PAGE_VALUE,
            limit = DEFAULT_LIMIT_VALUE,
        } = req.query as SearchQueryParams;
        const profilesData: ISearchProfileData = await this.profileService.searchProfileByName(
            searchText as string,
            page as number,
            limit as number,
        );
        res.status(HTTP_STATUS_CODE.OK).json(
            createSuccessResponse('User Profiles fetched successfully', profilesData),
        );
    };

    public editProfile = async (req: Request, res: Response): Promise<void> => {
        const { userId } = req.currentUser as IJwtPayload;
        const user: IProfileDocument | null = await this.profileService.updateProfile(
            userId,
            req.body as ProfileUpdate,
        );
        res.status(HTTP_STATUS_CODE.OK).json(createSuccessResponse('Profile updated successfully', user));
    };
}
