import { ClientSession } from 'mongoose';
import { IProfileDocument, ProfileModel } from '../model';
import { IProfile } from '../../types';

export class ProfileRepository {
    async create(profileData: Pick<IProfile, 'userId'>, session?: ClientSession): Promise<IProfileDocument> {
        const user: IProfileDocument[] = await ProfileModel.create([profileData], { session });
        return user[0];
    }

    async findByUserId(userId: string): Promise<IProfileDocument | null> {
        return await ProfileModel.findOne({ userId }).populate('userId').populate('addressId');
    }

    async findById(profileId: string): Promise<IProfileDocument | null> {
        return await ProfileModel.findById(profileId).populate('userId');
    }

    async update(
        userId: string,
        updateData: Partial<IProfile>,
        session?: ClientSession,
    ): Promise<IProfileDocument | null> {
        return await ProfileModel.findOneAndUpdate({userId}, updateData, { new: true, session });
    }
}
