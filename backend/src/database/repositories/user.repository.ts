import { ClientSession } from 'mongoose';
import { singleton } from 'tsyringe';
import { IUserDocument, UserModel } from '../models';
import { IUser, MinMaxYears } from '../../types';

@singleton()
export class UserRepository {
    private readonly excludedFields: string[] = ['-createdAt', '-updatedAt'];

    createUser = async (userData: Partial<IUser>, session?: ClientSession): Promise<IUserDocument> => {
        const user: IUserDocument[] = await UserModel.create([userData], { session });
        return user[0];
    };

    findUserByEmail = async (email: string, session?: ClientSession | null): Promise<IUser | null> => {
        return await UserModel.findOne({ email })
            .session(session!)
            .select([...this.excludedFields])
            .lean<IUser>();
    };

    findUserById = async (userId: string, session?: ClientSession | null): Promise<IUserDocument | null> => {
        return await UserModel.findById(userId)
            .session(session!)
            .select([...this.excludedFields, '-password'])
            .lean();
    };

    updateUser = async (
        userId: string,
        updateData: Partial<IUser>,
        session?: ClientSession,
    ): Promise<IUserDocument | null> => {
        return await UserModel.findByIdAndUpdate(userId, updateData, { new: true, session }).select(
            this.excludedFields,
        );
    };

    findMinMaxYears = async (): Promise<MinMaxYears> => {
        const result = await UserModel.aggregate([
            {
                $group: {
                    _id: null, // Group all documents together
                    minYear: { $min: { $year: '$createdAt' } }, // Get the minimum year
                    maxYear: { $max: { $year: '$createdAt' } }, // Get the maximum year
                },
            },
            {
                $project: {
                    _id: 0, // Exclude the _id field from the result
                    minYear: 1,
                    maxYear: 1,
                },
            },
        ]);

        return result.length > 0 ? result[0] : { minYear: null, maxYear: null };
    };
}
