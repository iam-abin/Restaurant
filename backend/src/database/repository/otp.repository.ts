import { ClientSession } from 'mongoose';
import { singleton } from 'tsyringe';
import { IOtpTokenDocument, OtpTokenModel } from '../model';
import { IOtpToken } from '../../types';

@singleton()
export class OtpTokenRepository {
    create = async (otpData: Partial<IOtpToken>, session?: ClientSession): Promise<IOtpTokenDocument> => {
        // Here we are performing upsert
        return await OtpTokenModel.findOneAndUpdate(
            { userId: otpData.userId },
            { ...otpData, createdAt: new Date() }, // Updates `createdAt` to extend OTP validity by 10 minutes
            {
                new: true,
                session,
                upsert: true,
            },
        );
    };

    findByUserId = async (userId: string): Promise<IOtpTokenDocument | null> => {
        return await OtpTokenModel.findOne({ userId });
    };

    findByResetToken = async (resetToken: string): Promise<IOtpTokenDocument | null> => {
        return await OtpTokenModel.findOne({ resetToken });
    };

    deleteById = async (id: string, session?: ClientSession): Promise<IOtpTokenDocument | null> => {
        return await OtpTokenModel.findByIdAndDelete(id, { returnDocument: 'before', session });
    };
}
