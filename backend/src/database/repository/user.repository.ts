import { ClientSession } from 'mongoose';
import { IUserDocument, UserModel } from '../model';
import { ISignup, IUser } from '../../types';

export class UserRepository {
    async createUser(userData: Partial<IUser>, session?: ClientSession): Promise<IUserDocument> {
        const user: IUserDocument[] = await UserModel.create([userData], { session });
        return user[0];
    }

    async findByEmail(email: string): Promise<IUserDocument | null> {
        return await UserModel.findOne({ email });
    }

    async findUserById(userId: string): Promise<IUserDocument | null> {
        return await UserModel.findById(userId);
    }
    async updateUser(
        userId: string,
        updateData: Partial<IUser>,
        session?: ClientSession,
    ): Promise<IUserDocument | null> {
        return await UserModel.findByIdAndUpdate(userId, updateData, { new: true, session });
    }

    async updateUserVerification(userId: string): Promise<IUserDocument | null> {
        return await UserModel.findByIdAndUpdate(userId, { isVerified: true }, { new: true });
    }
}
