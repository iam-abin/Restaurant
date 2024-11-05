import { ClientSession } from 'mongoose';
import { OtpDto } from '../../dto/otp.dto';
import { IOtp, OtpModel } from '../model';

export class OtpRepository {
    async createOtp(otpData: OtpDto, session?: ClientSession): Promise<IOtp> {
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

    async findByUserId(userId: string): Promise<IOtp | null> {
        return await OtpModel.findOne({ userId });
    }
}
