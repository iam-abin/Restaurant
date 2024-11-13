import { ClientSession } from 'mongoose';
import { IOtpDocument, OtpModel } from '../model';
import { IOtp } from '../../types';

export class OtpRepository {
    async createOtp(otpData: IOtp, session?: ClientSession): Promise<IOtpDocument> {
        // Here we are performing upsert
        return await OtpModel.findOneAndUpdate(
            { userId: otpData.userId },
            { ...otpData, createdAt: new Date() }, // Updates `createdAt` to extend OTP validity by 10 minutes
            {
                new: true,
                session,
                upsert: true,
            },
        );
    }

    async findByUserId(userId: string): Promise<IOtpDocument | null> {
        return await OtpModel.findOne({ userId });
    }
}
