import { ClientSession } from 'mongoose';
import { singleton } from 'tsyringe';
import { IUserDocument, UserModel } from '../model';
import { IUser } from '../../types';

@singleton()
export class UserRepository {
    async createUser(userData: Partial<IUser>, session?: ClientSession): Promise<IUserDocument> {
        const user: IUserDocument[] = await UserModel.create([userData], { session });
        return user[0];
    }

    async findUserByEmail(email: string): Promise<IUserDocument | null> {
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
}
