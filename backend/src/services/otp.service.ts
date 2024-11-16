import { autoInjectable } from 'tsyringe';

import { BadRequestError, NotFoundError } from '../errors';
import { generateOtp, checkOtpIntervalCompleted, sendEmail, ROLES_CONSTANTS } from '../utils';
import {
    OtpTokenRepository,
    UserRepository,
    ProfileRepository,
    RestaurantRepository,
} from '../database/repository';
import { IOtpTokenDocument, IUserDocument } from '../database/model';
import { createToken } from '../utils';
import { IEmailTemplate } from '../types';
import { getEmailVerificationTemplate } from '../templates/signupVerificationEmail';
import { getForgotPasswordEmailTemplate } from '../templates/forgotPasswordEmail';
import { appConfig } from '../config/app.config';

@autoInjectable()
export class OtpService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly otpTokenRepository: OtpTokenRepository,
        private readonly profileRepository: ProfileRepository,
        private readonly restaurantRepository: RestaurantRepository,
    ) {}

    public async verifyOtp(userId: string, otp: string): Promise<IUserDocument | null> {
        const user: IUserDocument | null = await this.userRepository.findUserById(userId);
        if (!user) throw new NotFoundError('This user does not exist');

        // Check usere is verified
        if (user.isVerified) throw new BadRequestError('You are already verified. Please signin');

        // If user is not verified, Check otp
        const otpData: IOtpTokenDocument | null = await this.otpTokenRepository.findByUserId(userId);
        if (!otpData) throw new NotFoundError('Otp has expired');
        if (otp != otpData.otp) throw new BadRequestError('Invalid otp');

        // Update the user's verification status
        const updatedUser: IUserDocument | null = await this.userRepository.updateUserVerification(userId);
        if (user.role === ROLES_CONSTANTS.USER) {
            await this.profileRepository.create({ userId });
        } else if (user.role === ROLES_CONSTANTS.RESTAURANT) {
            await this.restaurantRepository.create({ ownerId: userId });
        }

        await this.otpTokenRepository.delete(otpData.id);
        return updatedUser;
    }

    public async resendOtp(userId: string): Promise<IUserDocument> {
        const user: IUserDocument | null = await this.userRepository.findUserById(userId);
        if (!user) throw new NotFoundError('This user does not exist');
        if (user.isVerified) throw new BadRequestError('You are already verified. Please signin');

        // Check if an OTP already exists and hasn't expired (optional, based on use case)
        const existOtp: IOtpTokenDocument | null = await this.otpTokenRepository.findByUserId(userId);
        if (existOtp) {
            const isResendTimeLimitCompleted = checkOtpIntervalCompleted(existOtp.createdAt);
            if (!isResendTimeLimitCompleted) {
                throw new BadRequestError('OTP has been recently sent. Please wait before requesting again.');
            }
        }

        // Generate a new OTP and send confirmation email
        const otp: string = generateOtp();
        await this.otpTokenRepository.create({ userId, otp });

        const emailTemplate: IEmailTemplate = getEmailVerificationTemplate(otp);
        await sendEmail(user.email, emailTemplate);
        return user;
    }

    public async forgotPassword(email: string): Promise<IUserDocument> {
        const user: IUserDocument | null = await this.userRepository.findByEmail(email);
        if (!user) throw new NotFoundError('This user does not exist');
        if (!user.isVerified)
            throw new BadRequestError('You are not verified. Please signup again with email to get verified');

        // Check if an OTP already exists and hasn't expired (optional, based on use case)
        const existToken: IOtpTokenDocument | null = await this.otpTokenRepository.findByUserId(user.id);
        if (existToken) {
            const isResendTimeLimitCompleted = checkOtpIntervalCompleted(existToken.createdAt);
            if (!isResendTimeLimitCompleted) {
                throw new BadRequestError(
                    'TOKEN has been recently sent. Please wait a minute before requesting again.',
                );
            }
        }

        // Generate a new tokento send reset password verification email
        const token: string = createToken();
        // Here we are storing token in otp collection.
        // Can be change this logic in future
        await this.otpTokenRepository.create({ userId: user.id, resetToken: token });

        const resetURL = `${appConfig.FRONTEND_URL}/reset-password/${token}`;
        const emailTemplate: IEmailTemplate = getForgotPasswordEmailTemplate(resetURL);
        await sendEmail(email, emailTemplate);
        return user;
    }

    public async verifyResetToken(resetToken: string): Promise<IUserDocument | null> {
        const resetTokenData: IOtpTokenDocument | null =
            await this.otpTokenRepository.findByResetToken(resetToken);
        if (!resetTokenData) throw new NotFoundError('Reset token has expired');
        if (resetToken != resetTokenData.resetToken) throw new BadRequestError('Invalid reset Token');

        const user: IUserDocument | null = await this.userRepository.findUserById(
            resetTokenData.userId.toString(),
        );
        if (!user) throw new NotFoundError('This user does not exist');
        await this.otpTokenRepository.delete(resetTokenData.id);

        return user;
    }

    public async resetPassword(uesrId: string, password: string): Promise<IUserDocument | null> {
        const user: IUserDocument | null = await this.userRepository.findUserById(uesrId);
        if (!user) throw new NotFoundError('This user does not exist');

        // Update the user's verification status
        const updatedUser: IUserDocument | null = await this.userRepository.updateUser(user.id, { password });
        return updatedUser;
    }
}
