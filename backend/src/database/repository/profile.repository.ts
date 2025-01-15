import { ClientSession } from 'mongoose';
import { singleton } from 'tsyringe';
import { IProfileDocument, ProfileModel } from '../model';
import { CountByDay, IProfile, ISearchProfileResult } from '../../types';

@singleton()
export class ProfileRepository {
    createProfile = async (
        profileData: Pick<IProfile, 'userId' | 'imageUrl'>,
        session?: ClientSession,
    ): Promise<IProfileDocument> => {
        const user: IProfileDocument[] = await ProfileModel.create([profileData], { session });
        return user[0];
    };

    findProfileByUserId = async (userId: string): Promise<IProfileDocument | null> => {
        return await ProfileModel.findOne({ userId }).populate(['userId', 'addressId']);
    };

    findProfiles = async (skip: number, limit: number): Promise<IProfileDocument[]> => {
        return await ProfileModel.find()
            .skip(skip ?? 0)
            .limit(limit ?? 0)
            .populate('userId');
    };

    searchProfileByName = async (
        searchText: string,
        skip: number,
        limit: number,
    ): Promise<ISearchProfileResult> => {
        const pipeline = [
            // Lookup the associated user details
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userId', // Name of the field to include user details
                },
            },
            // Unwind the user details array
            {
                $unwind: {
                    path: '$userId',
                    preserveNullAndEmptyArrays: true, // Keep profiles even if no user is found
                },
            },
            // Match based on the user name
            {
                $match: {
                    'userId.name': {
                        $regex: new RegExp(searchText, 'i'), // Escape special chars and use case-insensitive flag
                    },
                },
            },
            // Project required fields
            {
                $project: {
                    _id: 1,
                    imageUrl: 1,
                    'userId._id': 1,
                    'userId.name': 1,
                    'userId.email': 1,
                    'userId.phone': 1,
                    'userId.isBlocked': 1,
                    'userId.role': 1,
                },
            },
            // Use $facet to calculate count and get paginated results
            {
                $facet: {
                    totalCount: [{ $count: 'count' }], // Count the total number of matching documents
                    results: [{ $skip: skip }, { $limit: limit }],
                },
            },
        ];

        const result = await ProfileModel.aggregate(pipeline);

        // Extract results and totalCount from the pipeline output
        const profiles = result[0]?.results || [];
        const totalCount = result[0]?.totalCount?.[0]?.count || 0;

        return { profiles, totalCount };
    };

    updateProfile = async (
        userId: string,
        updateData: Partial<IProfile>,
        session?: ClientSession,
    ): Promise<IProfileDocument | null> => {
        return await ProfileModel.findOneAndUpdate({ userId }, updateData, { new: true, session }).populate([
            'userId',
            'addressId',
        ]);
    };

    countProfiles = async (): Promise<number> => {
        return await ProfileModel.countDocuments();
    };

    countLast7DaysCreatedProfiles = async (startDate: Date): Promise<CountByDay[]> => {
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
    };
}
