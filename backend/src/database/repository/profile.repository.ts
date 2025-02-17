import { ClientSession, PipelineStage } from 'mongoose';
import { singleton } from 'tsyringe';
import { IProfileDocument, ProfileModel } from '../model';
import { CountByMonth, IProfile, ISearchProfileResult } from '../../types';

@singleton()
export class ProfileRepository {
    private readonly excludedFields: string[] = ['-createdAt', '-updatedAt', '-__v'];

    createProfile = async (
        profileData: Pick<IProfile, 'userId' | 'imageUrl'>,
        session?: ClientSession,
    ): Promise<IProfileDocument> => {
        const user: IProfileDocument[] = await ProfileModel.create([profileData], { session });
        return user[0];
    };

    findProfileByUserId = async (
        userId: string,
        session?: ClientSession | null,
    ): Promise<IProfileDocument | null> => {
        return await ProfileModel.findOne({ userId })
            .session(session!)
            .populate([
                {
                    path: 'userId',
                    select: 'name email phone',
                },
                {
                    path: 'addressId',
                    select: this.excludedFields,
                },
            ])
            .select(this.excludedFields)
            .lean<IProfileDocument | null>();
    };

    findProfiles = async (skip: number = 0, limit: number = 0): Promise<IProfileDocument[]> => {
        return await ProfileModel.find()
            .select([...this.excludedFields, '-addressId', '-isVerified'])
            .skip(skip)
            .limit(limit)
            .populate('userId', [...this.excludedFields, '-password'])
            .lean<IProfileDocument[]>();
    };

    searchProfileByName = async (
        searchText: string,
        skip: number,
        limit: number,
    ): Promise<ISearchProfileResult> => {
        const pipeline: PipelineStage[] = [
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

    findProfilesCountGroupedByMonth = async (year: number): Promise<CountByMonth[]> => {
        const pipeline: PipelineStage[] = [
            {
                $match: {
                    createdAt: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`),
                    },
                },
            },
            {
                $group: {
                    _id: { month: { $month: '$createdAt' } },
                    count: { $sum: 1 },
                },
            },
            {
                $project: {
                    month: '$_id.month',
                    count: 1,
                    _id: 0,
                },
            },
            {
                $sort: { month: 1 },
            },
        ];

        return await ProfileModel.aggregate(pipeline);
    };
}
