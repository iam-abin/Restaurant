import { autoInjectable } from 'tsyringe';

import { BadRequestError, NotFoundError } from '../errors';
import { generateOtp, checkOtpIntervalCompleted, sendEmail, ROLES_CONSTANTS } from '../utils';
import {
    OtpRepository,
    UserRepository,
    ProfileRepository,
    RestaurantRepository,
} from '../database/repository';
import { IOtpDocument, IUserDocument } from '../database/model';
import { createToken } from '../utils';
import { IEmailTemplate } from '../types';
import { getEmailVerificationTemplate } from '../templates/verificationEmail';
import { getForgotPasswordEmailTemplate } from '../templates/forgotPasswordEmail';
import { appConfig } from '../config/app.config';

@autoInjectable()
export class OtpService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly otpRepository: OtpRepository,
        private readonly profileRepository: ProfileRepository,
        private readonly restaurantRepository: RestaurantRepository,
    ) {}

    public async verify(userId: string, otp: string): Promise<IUserDocument | null> {
        const user: IUserDocument | null = await this.userRepository.findUserById(userId);
        if (!user) throw new NotFoundError('This user does not exist');

        // Check usere is verified
        if (user.isVerified) throw new BadRequestError('You are already verified. Please signin');

        // If user is not verified, Check otp
        const otpData: IOtpDocument | null = await this.otpRepository.findByUserId(userId);
        if (!otpData) throw new NotFoundError('Otp has expired');
        if (otp != otpData.otp) throw new BadRequestError('Invalid otp');

        // Update the user's verification status
        const updatedUser: IUserDocument | null = await this.userRepository.updateUserVerification(userId);
        if (user.role === ROLES_CONSTANTS.USER) {
            await this.profileRepository.create({ userId });
        } else if (user.role === ROLES_CONSTANTS.RESTAURANT) {
            await this.restaurantRepository.create({ ownerId: userId });
        }
        return updatedUser;
    }

    public async resendOtp(userId: string): Promise<IUserDocument> {
        const user: IUserDocument | null = await this.userRepository.findUserById(userId);
        if (!user) throw new NotFoundError('This user does not exist');
        if (user.isVerified) throw new BadRequestError('You are already verified. Please signin');

        // Check if an OTP already exists and hasn't expired (optional, based on use case)
        const existOtp: IOtpDocument | null = await this.otpRepository.findByUserId(userId);
        if (existOtp) {
            const isResendTimeLimitCompleted = checkOtpIntervalCompleted(existOtp.createdAt);
            if (!isResendTimeLimitCompleted) {
                throw new BadRequestError('OTP has been recently sent. Please wait before requesting again.');
            }
        }

        // Generate a new OTP and send confirmation email
        const otp: string = generateOtp();
        await this.otpRepository.createOtp({ userId, otp });

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
        const existOtp: IOtpDocument | null = await this.otpRepository.findByUserId(user.id);
        if (existOtp) {
            const isResendTimeLimitCompleted = checkOtpIntervalCompleted(existOtp.createdAt);
            if (!isResendTimeLimitCompleted) {
                throw new BadRequestError(
                    'OTP has been recently sent. Please wait a minute before requesting again.',
                );
            }
        }

        // Generate a new tokento send reset password verification email
        const token: string = createToken();
        // Here we are storing token in otp collection.
        // Can be change this logic in future
        await this.otpRepository.createOtp({ userId: user.id, otp: token });

        const resetURL = `${appConfig.FRONTEND_URL}/reset-password/${token}`;
        const emailTemplate: IEmailTemplate = getForgotPasswordEmailTemplate(resetURL);
        await sendEmail(email, emailTemplate);
        return user;
    }

    public async resetPassword(
        email: string,
        password: string,
        resetToken: string,
    ): Promise<IUserDocument | null> {
        const user: IUserDocument | null = await this.userRepository.findByEmail(email);
        if (!user) throw new NotFoundError('This user does not exist');

        const resetTokenData: IOtpDocument | null = await this.otpRepository.findByUserId(user.id);
        if (!resetTokenData) throw new NotFoundError('Reset token has expired');
        if (resetToken != resetTokenData.otp) throw new BadRequestError('Invalid reset Token');

        // Update the user's verification status
        const updatedUser: IUserDocument | null = await this.userRepository.updateUser(user.id, { password });
        return updatedUser;
    }
}
