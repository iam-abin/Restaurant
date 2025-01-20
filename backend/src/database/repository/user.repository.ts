import { ClientSession } from 'mongoose';
import { singleton } from 'tsyringe';
import { IUserDocument, UserModel } from '../model';
import { IUser, MinMaxYears } from '../../types';

@singleton()
export class UserRepository {
    createUser = async (userData: Partial<IUser>, session?: ClientSession): Promise<IUserDocument> => {
        const user: IUserDocument[] = await UserModel.create([userData], { session });
        return user[0];
    };

    findUserByEmail = async (email: string): Promise<IUserDocument | null> => {
        return await UserModel.findOne({ email });
    };

    findUserById = async (userId: string): Promise<IUserDocument | null> => {
        return await UserModel.findById(userId);
    };
    updateUser = async (
        userId: string,
        updateData: Partial<IUser>,
        session?: ClientSession,
    ): Promise<IUserDocument | null> => {
        return await UserModel.findByIdAndUpdate(userId, updateData, { new: true, session });
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
