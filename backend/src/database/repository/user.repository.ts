import { ClientSession } from 'mongoose';
import { UserSignupDto } from '../../dto/auth.dto';
import { IUser, UserModel } from '../model';

export class UserRepository {
    async createUser(userData: UserSignupDto, session?: ClientSession): Promise<IUser> {
        const user: IUser[] = await UserModel.create([userData], { session });
        return user[0];
    }

    async findByEmail(email: string): Promise<IUser | null> {
        return await UserModel.findOne({ email });
    }

    async findUserById(userId: string): Promise<IUser | null> {
        return await UserModel.findById(userId);
    }
    async updateUser(
        userId: string,
        updateData: Partial<UserSignupDto>,
        session?: ClientSession,
    ): Promise<IUser | null> {
        return await UserModel.findByIdAndUpdate(userId, updateData, { new: true, session });
    }

    async updateUserVerification(userId: string): Promise<IUser | null> {
        return await UserModel.findByIdAndUpdate(userId, { isVerified: true }, { new: true });
    }
}
