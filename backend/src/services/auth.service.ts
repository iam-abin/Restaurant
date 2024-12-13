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
    verifyJwtRefreshToken,
    createJwtRefreshToken,
} from '../utils';
import {
    OtpTokenRepository,
    ProfileRepository,
    RestaurantRepository,
    UserRepository,
} from '../database/repository';
import mongoose from 'mongoose';
import { IOtpTokenDocument, IProfileDocument, IRestaurantDocument, IUserDocument } from '../database/model';
import { IEmailTemplate, IGoogleAuth, ISignin, ISignup } from '../types';
import { getEmailVerificationTemplate } from '../templates/signupVerificationEmail';

@autoInjectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly otpTokenRepository: OtpTokenRepository,
        private readonly profileRepository: ProfileRepository,
        private readonly restaurantRepository: RestaurantRepository,
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

    public async signIn(
        userSignInDto: ISignin,
    ): Promise<{ user: IUserDocument; accessToken: string; refreshToken: string }> {
        const { email, password, role } = userSignInDto;

        // Check if the user exists
        const existingUser: IUserDocument | null = await this.userRepository.findByEmail(email);
        if (!existingUser) throw new BadRequestError('Invalid email or password');

        //  // Check if the password is correct
        //  if (!existingUser.password) throw new BadRequestError('use google login');

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
            const isSamePassword: boolean = await comparePassword(password!, existingUser.password!);
            if (!isSamePassword) throw new BadRequestError('Invalid email or password');
        }

        // Generate JWT
        const userPayload: IJwtPayload = {
            userId: existingUser._id.toString(),
            email: existingUser.email,
            role: existingUser.role,
        };
        const jwtAccessToken: string = createJwtAccessToken(userPayload);
        const jwtRefreshToken: string = createJwtRefreshToken(userPayload);

        return { user: existingUser, accessToken: jwtAccessToken, refreshToken: jwtRefreshToken };
    }

    public async googleAuth(
        userData: IGoogleAuth,
    ): Promise<{ user: IUserDocument; accessToken: string; refreshToken: string }> {
        const { email, role, imageUrl } = userData;

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // Check if the user exists
            const existingUser: IUserDocument | null = await this.userRepository.findByEmail(email);
            if (!existingUser) {
                // Create a new user and generate OTP and send confirmation email
                const user: IUserDocument = await this.userRepository.createUser(
                    { ...userData, isVerified: true },
                    session,
                );
                const userId = user._id.toString();
                if (user.role === ROLES_CONSTANTS.USER) {
                    await this.profileRepository.create({ userId, imageUrl }, session);
                } else if (user.role === ROLES_CONSTANTS.RESTAURANT) {
                    await this.restaurantRepository.create({ ownerId: userId, imageUrl }, session);
                }

                // Generate JWT
                const userPayload: IJwtPayload = {
                    userId: user._id.toString(),
                    email: user.email,
                    role: user.role,
                };
                const jwtAccessToken: string = createJwtAccessToken(userPayload);
                const jwtRefreshToken: string = createJwtRefreshToken(userPayload);
                // Commit the transaction
                await session.commitTransaction();
                return { user, accessToken: jwtAccessToken, refreshToken: jwtRefreshToken };
            }

            // Check if the user is loggedin using google
            if (!existingUser.googleId) throw new BadRequestError('use another way to login');

            if (existingUser.role !== role) throw new BadRequestError('Role is not matching');

            if (existingUser.isBlocked) throw new ForbiddenError('You are a blocked user');

            if (role === ROLES_CONSTANTS.RESTAURANT) {
                const restaurant: IRestaurantDocument | null =
                    await this.restaurantRepository.findMyRestaurant(existingUser._id.toString());
                if (restaurant?.imageUrl !== imageUrl) {
                    await this.restaurantRepository.update(existingUser._id.toString(), { imageUrl });
                }
            } else if (role === ROLES_CONSTANTS.USER) {
                const profile: IProfileDocument | null = await this.profileRepository.findByUserId(
                    existingUser._id.toString(),
                );
                if (profile?.imageUrl !== imageUrl) {
                    await this.profileRepository.update(existingUser._id.toString(), { imageUrl });
                }
            }

            // Generate JWT
            const userPayload: IJwtPayload = {
                userId: existingUser._id.toString(),
                email: existingUser.email,
                role: existingUser.role,
            };
            const jwtAccessToken: string = createJwtAccessToken(userPayload);
            const jwtRefreshToken: string = createJwtRefreshToken(userPayload);
            return { user: existingUser, accessToken: jwtAccessToken, refreshToken: jwtRefreshToken };
        } catch (error) {
            // Rollback the transaction if something goes wrong
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }

    public async jwtRefresh(refreshToken: string): Promise<{ accessToken: string }> {
        const { userId }: IJwtPayload = verifyJwtRefreshToken(refreshToken);
        const user = await this.userRepository.findUserById(userId);
        if (!user) throw new NotFoundError('This user does not exist');
        // Generate JWT
        const userPayload: IJwtPayload = {
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
        };
        const jwtAccessToken: string = createJwtAccessToken(userPayload);

        return { accessToken: jwtAccessToken };
    }

    public async blockUnblockUser(userId: string): Promise<IUserDocument | null> {
        const user: IUserDocument | null = await this.userRepository.findUserById(userId);
        if (!user) throw new NotFoundError('This user does not exist');

        // Update the user's verification status
        const updatedUser: IUserDocument | null = await this.userRepository.updateUser(userId, {
            isBlocked: !user.isBlocked,
        });
        return updatedUser;
    }
}
