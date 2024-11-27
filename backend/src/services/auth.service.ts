import { autoInjectable } from 'tsyringe';

import { BadRequestError, ForbiddenError, NotFoundError } from '../errors';
import {
    checkOtpIntervalCompleted,
    generateOtp,
    comparePassword,
    createJwtAccessToken,
    IJwtPayload,
    sendEmail,
    ROLES_CONSTANTS,
} from '../utils';
import { OtpTokenRepository, UserRepository } from '../database/repository';
import mongoose from 'mongoose';
import { IOtpTokenDocument, IUserDocument } from '../database/model';
import { IEmailTemplate, ISignin, ISignup } from '../types';
import { getEmailVerificationTemplate } from '../templates/signupVerificationEmail';

@autoInjectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly otpTokenRepository: OtpTokenRepository,
    ) {}

    public async signUp(userRegisterDto: ISignup): Promise<IUserDocument | null> {
        const { email } = userRegisterDto;
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const existingUser: IUserDocument | null = await this.userRepository.findByEmail(email);
            // If the user already exists but is not verified
            if (existingUser && !existingUser.isVerified) {
                // Check if an OTP already exists and hasn't expired (optional, based on use case)
                const existingOtp: IOtpTokenDocument | null = await this.otpTokenRepository.findByUserId(
                    existingUser.id,
                );
                if (existingOtp) {
                    const isResendTimeLimitCompleted = checkOtpIntervalCompleted(existingOtp.createdAt);
                    if (!isResendTimeLimitCompleted) {
                        throw new BadRequestError(
                            'OTP has been recently sent. Please wait a minute before requesting again.',
                        );
                    }
                }

                const otp: string = generateOtp();
                await this.otpTokenRepository.create({ userId: existingUser.id, otp }, session);

                // Update if user enter new name or password
                const updatedUser: IUserDocument | null = await this.userRepository.updateUser(
                    existingUser.id,
                    userRegisterDto,
                    session,
                );

                const emailTemplate: IEmailTemplate = getEmailVerificationTemplate(otp);
                await sendEmail(email, emailTemplate);
                // Commit the transaction
                await session.commitTransaction();
                session.endSession();
                return updatedUser;
            }

            // If the user is already verified, throw an error
            if (existingUser) throw new BadRequestError('User already exists');

            // Create a new user and generate OTP and send confirmation email
            const user: IUserDocument = await this.userRepository.createUser(userRegisterDto, session);
            const otp: string = generateOtp();
            await this.otpTokenRepository.create({ userId: user.id, otp }, session);
            const emailTemplate: IEmailTemplate = getEmailVerificationTemplate(otp);
            await sendEmail(email, emailTemplate);

            // Commit the transaction
            await session.commitTransaction();
            return user;
        } catch (error) {
            // Rollback the transaction if something goes wrong
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }

    public async signIn(userSignInDto: ISignin): Promise<{ user: IUserDocument; accessToken: string }> {
        const { email, password, role } = userSignInDto;

        // Check if the user exists
        const existingUser: IUserDocument | null = await this.userRepository.findByEmail(email);
        if (!existingUser) throw new BadRequestError('Invalid email or password');

        if (existingUser.role !== role) throw new BadRequestError('Role is not matching');

        if (role === ROLES_CONSTANTS.ADMIN) {
            if (email !== existingUser.email && password !== existingUser.password)
                throw new BadRequestError('Invalid email or password');
        } else {
            // Check if the user is verified
            if (!existingUser.isVerified) {
                throw new ForbiddenError(
                    'You are not verified yet. Pleas verify by signup again to get otp.',
                );
            }

            if (existingUser.isBlocked) throw new ForbiddenError('You are a blocked user');

            // Check if the password is correct
            const isSamePassword: boolean = await comparePassword(password, existingUser.password);
            if (!isSamePassword) throw new BadRequestError('Invalid email or password');
        }

        // Generate JWT
        const userPayload: IJwtPayload = {
            userId: existingUser.id,
            email: existingUser.email,
            role: existingUser.role,
        };
        const jwt: string = createJwtAccessToken(userPayload);

        return { user: existingUser, accessToken: jwt };
    }

    public async blockUnblockUser(userId: string): Promise<IUserDocument | null> {
        const user: IUserDocument | null = await this.userRepository.findUserById(userId);
        if (!user) throw new NotFoundError('This user does not exist');

        // Update the user's verification status
        const updatedUser: IUserDocument | null = await this.userRepository.updateUser(userId, { isBlocked: !user.isBlocked });
        return updatedUser;
    }
}
