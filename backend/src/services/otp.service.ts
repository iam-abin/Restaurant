import { autoInjectable } from 'tsyringe';
import { BadRequestError, ForbiddenError, NotFoundError } from '../errors';
import {
    generateOtp,
    isOtpTOkenResendAllowed,
    sendEmail,
    RESET_PASSWORD_URL,
    createToken,
    executeTransaction,
    checkIsOtpTokenExpired,
    calculateExpiryTime,
} from '../utils';
import {
    OtpTokenRepository,
    UserRepository,
    ProfileRepository,
    RestaurantRepository,
} from '../database/repository';
import { IOtpTokenDocument, IUserDocument } from '../database/model';
import { IEmailTemplate, IOtpTokenData, UserRole } from '../types';
import { getEmailVerificationTemplate } from '../templates/signupVerificationEmail';
import { getForgotPasswordEmailTemplate } from '../templates/forgotPasswordEmail';

@autoInjectable()
export class OtpService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly otpTokenRepository: OtpTokenRepository,
        private readonly profileRepository: ProfileRepository,
        private readonly restaurantRepository: RestaurantRepository,
    ) {}

    public verifyOtp = async (userId: string, otp: string): Promise<IUserDocument | null> => {
        return executeTransaction(async (session) => {
            const user: IUserDocument = await this.validateUserExistence(userId);

            // Check if the user is already verified
            if (user.isVerified) throw new BadRequestError('You are already verified. Please signin');

            // If user is not verified, Check otp
            const otpData: IOtpTokenDocument | null = await this.otpTokenRepository.findByUserId(userId);
            if (!otpData) throw new BadRequestError('Otp has expired');
            const isExpired: boolean = checkIsOtpTokenExpired(otpData?.expiresAt);
            if (isExpired) {
                await this.otpTokenRepository.deleteById(otpData._id.toString());
                throw new BadRequestError('Otp has expired');
            }
            if (otp !== otpData.otp) throw new BadRequestError('Invalid otp');

            // Update the user's verification status
            const updatedUser: IUserDocument | null = await this.userRepository.updateUser(
                userId,
                { isVerified: true },
                session,
            );
            if (user.role === UserRole.USER) {
                await this.profileRepository.createProfile({ userId }, session);
            } else if (user.role === UserRole.RESTAURANT) {
                await this.restaurantRepository.createRestaurant({ ownerId: userId }, session);
            }

            await this.otpTokenRepository.deleteById(otpData._id.toString(), session);

            return updatedUser;
        });
    };

    public resendOtp = async (userId: string): Promise<IOtpTokenData> => {
        return executeTransaction(async (session) => {
            const user: IUserDocument = await this.validateUserExistence(userId);

            if (user.isVerified) throw new BadRequestError('You are already verified. Please signin');

            // Check if an OTP already exists and hasn't expired
            const existOtp: IOtpTokenDocument | null = await this.otpTokenRepository.findByUserId(userId);
            if (existOtp) {
                const isResendTimeLimitCompleted: boolean = isOtpTOkenResendAllowed(existOtp.createdAt);
                if (!isResendTimeLimitCompleted) {
                    throw new BadRequestError(
                        'OTP has been recently sent. Please wait before requesting again.',
                    );
                }
                const isExpired: boolean = checkIsOtpTokenExpired(existOtp?.expiresAt);
                if (isExpired) {
                    // If otp expired, delete existing one before creating a new one
                    await this.otpTokenRepository.deleteById(existOtp._id.toString(), session);
                }
            }

            // Generate a new OTP and send confirmation email
            const otp: string = generateOtp();
            const otpResponse: IOtpTokenDocument = await this.otpTokenRepository.create(
                { userId, otp },
                session,
            );

            const emailTemplate: IEmailTemplate = getEmailVerificationTemplate(user.name, otp);
            await sendEmail(user.email, emailTemplate);
            return { user, otpOrTokenExpiresAt: otpResponse.expiresAt };
        });
    };

    public forgotPassword = async (email: string): Promise<IOtpTokenData> => {
        return executeTransaction(async (session) => {
            const user: IUserDocument | null = await this.userRepository.findUserByEmail(email);
            if (!user) throw new NotFoundError('This user does not exist');
            if (!user.isVerified)
                throw new ForbiddenError(
                    'You are not verified. Please signup again with email to get verified',
                );

            // Check if a Token already exists and hasn't expired
            const existToken: IOtpTokenDocument | null = await this.otpTokenRepository.findByUserId(
                user._id.toString(),
            );
            if (existToken) {
                const isResendTimeLimitCompleted: boolean = isOtpTOkenResendAllowed(existToken.createdAt);
                if (!isResendTimeLimitCompleted) {
                    throw new BadRequestError(
                        'Token has been recently sent. Please wait a minute before requesting again.',
                    );
                }

                const isExpired: boolean = checkIsOtpTokenExpired(existToken?.expiresAt);
                if (isExpired) {
                    // If token expired, delete existing one before creating a new one
                    await this.otpTokenRepository.deleteById(existToken._id.toString(), session);
                }
            }

            // Generate a new token to send reset password verification email
            const token: string = createToken();

            // Here we are storing token in otp collection.
            const tokenData: IOtpTokenDocument = await this.otpTokenRepository.create(
                { userId: user._id.toString(), resetToken: token },
                session,
            );

            const resetURL: string = `${RESET_PASSWORD_URL}/${token}`;
            const otpExpiryInSeconds = calculateExpiryTime(tokenData.expiresAt);
            const emailTemplate: IEmailTemplate = getForgotPasswordEmailTemplate(
                resetURL,
                otpExpiryInSeconds,
            );
            await sendEmail(email, emailTemplate);
            return { user, otpOrTokenExpiresAt: tokenData.expiresAt };
        });
    };

    public verifyResetToken = async (resetToken: string): Promise<IUserDocument | null> => {
        const resetTokenData: IOtpTokenDocument | null =
            await this.otpTokenRepository.findByResetToken(resetToken);
        if (!resetTokenData) throw new BadRequestError('Reset token has expired');
        const isExpired: boolean = checkIsOtpTokenExpired(resetTokenData?.expiresAt);
        if (isExpired) {
            await this.otpTokenRepository.deleteById(resetTokenData._id.toString());
            throw new BadRequestError('Reset token has expired');
        }
        if (resetToken !== resetTokenData.resetToken) throw new BadRequestError('Invalid reset Token');

        const user: IUserDocument = await this.validateUserExistence(resetTokenData.userId.toString());
        await this.otpTokenRepository.deleteById(resetTokenData._id.toString());

        return user;
    };

    public resetPassword = async (userId: string, password: string): Promise<IUserDocument | null> => {
        const user: IUserDocument = await this.validateUserExistence(userId);

        // Update the user's verification status
        const updatedUser: IUserDocument | null = await this.userRepository.updateUser(user._id.toString(), {
            password,
        });
        return updatedUser;
    };

    private validateUserExistence = async (userId: string): Promise<IUserDocument> => {
        const user: IUserDocument | null = await this.userRepository.findUserById(userId);
        if (!user) throw new NotFoundError('This user does not exist.');
        return user;
    };
}
