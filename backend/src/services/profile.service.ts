import { autoInjectable } from 'tsyringe';

import { NotFoundError } from '../errors';

import { ProfileRepository } from '../database/repository';
import { IProfileDocument } from '../database/model';
import { IProfile } from '../types';

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
    ): Promise<IProfileDocument | null> {
        const profile: IProfileDocument | null = await this.profileRepository.update(profileId, updateData);
        if (!profile) throw new NotFoundError('This profile does not exist');
        return profile;
    }
}
