import { autoInjectable } from 'tsyringe';

import { BadRequestError, NotAuthorizedError, NotFoundError } from '../errors';
import {
    checkOtpIntervalCompleted,
    generateOtp,
    comparePassword,
    createJwtAccessToken,
    IJwtPayload,
    sendEmail,
} from '../utils';
import { OtpRepository, UserRepository } from '../database/repository';
import mongoose from 'mongoose';
import { IOtpDocument, IUserDocument } from '../database/model';
import { IEmailTemplate, ISignin, ISignup } from '../types';
import { getEmailVerificationTemplate } from '../templates/verificationEmail';

@autoInjectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly otpRepository: OtpRepository,
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
                const existingOtp: IOtpDocument | null = await this.otpRepository.findByUserId(
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
                await this.otpRepository.createOtp({ userId: existingUser._id as string, otp }, session);

                // Update if user enter new name or password
                const updatedUser: IUserDocument | null = await this.userRepository.updateUser(
                    existingUser._id as string,
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
            await this.otpRepository.createOtp({ userId: user._id as string, otp }, session);
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
        const { email, password } = userSignInDto;

        // Check if the user exists
        const existingUser: IUserDocument | null = await this.userRepository.findByEmail(email);
        if (!existingUser) throw new BadRequestError('Invalid email or password');

        // Check if the user is verified
        if (!existingUser.isVerified) {
            throw new NotAuthorizedError(
                'You are not verified yet. Pleas verify by signup again to get otp.',
            );
        }

        // Check if the password is correct
        const isSamePassword: boolean = await comparePassword(password, existingUser.password);
        if (!isSamePassword) throw new BadRequestError('Invalid email or password');

        // Generate JWT
        const userPayload: IJwtPayload = {
            userId: existingUser._id as string,
            name: existingUser.name,
            email: existingUser.email,
            role: existingUser.role,
        };
        const jwt: string = createJwtAccessToken(userPayload);

        return { user: existingUser, accessToken: jwt };
    }

    public async getProfile(userId: string): Promise<IUserDocument | null> {
        const user: IUserDocument | null = await this.userRepository.findUserById(userId);
        if (!user) throw new NotFoundError('This user does not exist');
        return user;
    }
}