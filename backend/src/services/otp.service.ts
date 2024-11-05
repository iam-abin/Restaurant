import { autoInjectable } from 'tsyringe';
import { IOtp, IUser } from '../database/model';
import { BadRequestError, NotFoundError } from '../errors';
import { sendConfirmationEmail } from '../utils';
import { OtpRepository, UserRepository } from '../database/repository';
import { generateOtp } from '../utils';

@autoInjectable()
export class OtpService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly otpRepository: OtpRepository,
    ) {}

    public async verify(userId: string, otp: string): Promise<IUser | null> {
        const user: IUser | null = await this.userRepository.findUserById(userId);
        if (!user) throw new NotFoundError('This user does not exist');

        // Check usere is verified
        if (user.isVerified) throw new BadRequestError('You are already verified. Please signin');

        // If user is not verified, Check otp
        const otpData: IOtp | null = await this.otpRepository.findByUserId(userId);
        if (!otpData) throw new NotFoundError('Otp has expired');
        if (otp != otpData.otp) throw new BadRequestError('Invalid otp');

        // Update the user's verification status
        const updatedUser: IUser | null = await this.userRepository.updateUserVerification(userId);
        return updatedUser;
    }

    public async resendOtp(userId: string): Promise<IUser> {
        const user: IUser | null = await this.userRepository.findUserById(userId);
        if (!user) throw new NotFoundError('This user does not exist');
        if (user.isVerified) throw new BadRequestError('You are already verified. Please signin');

        // Check if an OTP already exists and hasn't expired (optional, based on use case)
        const existingOtp: IOtp | null = await this.otpRepository.findByUserId(userId);
        if (existingOtp) {
            const timeSinceLastOtp = new Date().getTime() - existingOtp.createdAt.getTime();
            const otpResendThreshold = 60 * 1000; // e.g., 1 minute threshold

            if (timeSinceLastOtp < otpResendThreshold) {
                throw new BadRequestError('OTP has been recently sent. Please wait before requesting again.');
            }
        }

        // Generate a new OTP and send confirmation email
        const otp: string = generateOtp();
        const createdOtp: IOtp = await this.otpRepository.createOtp({ userId, otp });
        await sendConfirmationEmail(user.email, createdOtp.otp);
        return user;
    }
}
