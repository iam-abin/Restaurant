import { ClientSession } from 'mongoose';
import { singleton } from 'tsyringe';
import { IProfileDocument, ProfileModel } from '../model';
import { CountByDay, IProfile } from '../../types';

@singleton()
export class ProfileRepository {
    create= async (
        profileData: Pick<IProfile, 'userId' | 'imageUrl'>,
        session?: ClientSession,
    ): Promise<IProfileDocument> =>{
        const user: IProfileDocument[] = await ProfileModel.create([profileData], { session });
        return user[0];
    }

    findByUserId= async (userId: string): Promise<IProfileDocument | null> =>{
        return await ProfileModel.findOne({ userId }).populate(['userId', 'addressId']);
    }

    findById= async (profileId: string): Promise<IProfileDocument | null> =>{
        return await ProfileModel.findById(profileId).populate('userId');
    }

    findProfiles= async (skip: number, limit: number): Promise<IProfileDocument[]> =>{
        return await ProfileModel.find()
            .skip(skip ?? 0)
            .limit(limit ?? 0)
            .populate('userId');
    }

    update= async (
        userId: string,
        updateData: Partial<IProfile>,
        session?: ClientSession,
    ): Promise<IProfileDocument | null> =>{
        return await ProfileModel.findOneAndUpdate({ userId }, updateData, { new: true, session }).populate([
            'userId',
            'addressId',
        ]);
    }

    countProfiles= async (): Promise<number> =>{
        return await ProfileModel.countDocuments();
    }

    countLast7DaysCreatedProfiles= async (startDate: Date): Promise<CountByDay[]> =>{
        const counts: CountByDay[] = await ProfileModel.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate }, // Only include documents from the last 7 days
                },
            },
            {
                $project: {
                    date: {
                        $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }, // Format date to 'YYYY-MM-DD'
                    },
                },
            },
            {
                $group: {
                    _id: '$date', // Group by formatted date
                    count: { $sum: 1 }, // Count the number of users for each date
                },
            },
            {
                $addFields: { date: '$_id' }, // Copy `_id` to `date`
            },
            {
                $project: { _id: 0 }, // Remove the `_id` field
            },
            {
                $sort: { date: 1 }, // Sort by date in ascending order
            },
        ]);
        return counts;
    }
}
