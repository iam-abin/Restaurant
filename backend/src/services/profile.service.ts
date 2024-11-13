import { autoInjectable } from 'tsyringe';

import { NotFoundError } from '../errors';

import { ProfileRepository } from '../database/repository';
import { IProfileDocument } from '../database/model';
import { IProfile } from '../types';
import { uploadImageOnCloudinary } from '../utils';

@autoInjectable()
export class ProfileService {
    constructor(private readonly profileRepository: ProfileRepository) {}

    public async getProfile(userId: string): Promise<IProfileDocument | null> {
        const profile: IProfileDocument | null = await this.profileRepository.findById(userId);
        if (!profile) throw new NotFoundError('This profile does not exist');
        return profile;
    }

    public async updateProfile(
        profileId: string,
        updateData: Partial<IProfile>,
        file?: Express.Multer.File,
    ): Promise<IProfileDocument | null> {
        let imageUrl: string | undefined;
        if (file) {
            imageUrl = await uploadImageOnCloudinary(file);
        }
        const profile: IProfileDocument | null = await this.profileRepository.update(profileId, {
            ...updateData,
            imageUrl,
        });
        if (!profile) throw new NotFoundError('This profile does not exist');
        return profile;
    }
}
