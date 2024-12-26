import mongoose from 'mongoose';
import { autoInjectable } from 'tsyringe';

import { BadRequestError, ForbiddenError, NotFoundError } from '../errors';
import {
    checkOtpIntervalCompleted,
    generateOtp,
    comparePassword,
    createJwtAccessToken,
    sendEmail,
    ROLES_CONSTANTS,
    verifyJwtRefreshToken,
    createJwtRefreshToken,
    verifyGoogleCredentialToken,
} from '../utils';
import {
    OtpTokenRepository,
    ProfileRepository,
    RestaurantRepository,
    UserRepository,
} from '../database/repository';
import { IOtpTokenDocument, IProfileDocument, IRestaurantDocument, IUserDocument } from '../database/model';
import {
    DecodedGoogleToken,
    IEmailTemplate,
    IGoogleAuth,
    IGoogleAuthCredential,
    ISignin,
    ISignup,
    Tokens,
    IJwtPayload,
} from '../types';
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
                    existingUser._id.toString(),
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
                await this.otpTokenRepository.create({ userId: existingUser._id.toString(), otp }, session);

                // Update if user enter new name or password
                const updatedUser: IUserDocument | null = await this.userRepository.updateUser(
                    existingUser._id.toString(),
                    userRegisterDto,
                    session,
                );

                await this.sendVerificationEmail(email, otp);
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
            await this.otpTokenRepository.create({ userId: user._id.toString(), otp }, session);

            await this.sendVerificationEmail(email, otp);

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

        const existingUser: IUserDocument | null = await this.userRepository.findByEmail(email);
        if (!existingUser) throw new BadRequestError('Invalid email or password');

        // Check if the user is signedup using google
        if (existingUser.googleId) throw new BadRequestError('use another way to login');
        if (existingUser.role !== role) throw new BadRequestError('Role is not matching');
        if (existingUser.isBlocked) throw new ForbiddenError('You are a blocked user');

        if (role === ROLES_CONSTANTS.ADMIN) {
            if (email !== existingUser.email && password !== existingUser.password)
                throw new BadRequestError('Invalid email or password');
        } else {
            const isSamePassword: boolean = await comparePassword(password!, existingUser.password!);
            if (!isSamePassword) throw new BadRequestError('Invalid email or password');

            // Check if the user is verified
            if (!existingUser.isVerified) {
                throw new ForbiddenError(
                    'You are not verified yet. Pleas verify by signup again to get otp.',
                );
            }
        }

        const { accessToken, refreshToken }: Tokens = await this.generateTokens(existingUser);
        return { user: existingUser, accessToken, refreshToken };
    }

    public async googleAuth(
        authCredential: IGoogleAuthCredential,
    ): Promise<{ user: IUserDocument; accessToken: string; refreshToken: string }> {
        const { credential, role } = authCredential;

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const { name, email, picture, email_verified, sub }: DecodedGoogleToken =
                await verifyGoogleCredentialToken(credential);

            if (!email_verified) throw new ForbiddenError('Email is not verified');

            const userData: Omit<IGoogleAuth, 'picture'> = {
                name,
                email,
                imageUrl: picture,
                role,
                googleId: sub,
            };

            // Check if the user exists
            const existingUser: IUserDocument | null = await this.userRepository.findByEmail(email);
            if (!existingUser) {
                // Create a new user
                const user: IUserDocument = await this.userRepository.createUser(
                    { ...userData, isVerified: true },
                    session,
                );
                const userId: string = user._id.toString();
                if (user.role === ROLES_CONSTANTS.USER) {
                    await this.profileRepository.create({ userId, imageUrl: picture }, session);
                } else if (user.role === ROLES_CONSTANTS.RESTAURANT) {
                    await this.restaurantRepository.create({ ownerId: userId, imageUrl: picture }, session);
                }

                const { accessToken, refreshToken }: Tokens = await this.generateTokens(user);

                // Commit the transaction
                await session.commitTransaction();
                return { user, accessToken, refreshToken };
            }

            // Check if the user is loggedin using google
            if (!existingUser.googleId) throw new BadRequestError('use another way to login');
            if (existingUser.role !== role) throw new BadRequestError('Role is not matching');
            if (existingUser.isBlocked) throw new ForbiddenError('You are a blocked user');

            if (role === ROLES_CONSTANTS.RESTAURANT) {
                const restaurant: IRestaurantDocument | null =
                    await this.restaurantRepository.findMyRestaurant(existingUser._id.toString());
                if (restaurant?.imageUrl !== picture) {
                    await this.restaurantRepository.update(existingUser._id.toString(), {
                        imageUrl: picture,
                    });
                }
            } else if (role === ROLES_CONSTANTS.USER) {
                const profile: IProfileDocument | null = await this.profileRepository.findByUserId(
                    existingUser._id.toString(),
                );
                if (profile?.imageUrl !== picture) {
                    await this.profileRepository.update(existingUser._id.toString(), { imageUrl: picture });
                }
            }

            const { accessToken, refreshToken }: Tokens = await this.generateTokens(existingUser);

            return { user: existingUser, accessToken, refreshToken };
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
        const { accessToken }: Tokens = await this.generateTokens(user);
        return { accessToken };
    }

    public async updateBlockStatus(userId: string): Promise<IUserDocument | null> {
        const user: IUserDocument | null = await this.userRepository.findUserById(userId);
        if (!user) throw new NotFoundError('This user does not exist');

        const userWithUpdatedBlockStatus: IUserDocument | null = await this.userRepository.updateUser(
            userId,
            {
                isBlocked: !user.isBlocked,
            },
        );
        return userWithUpdatedBlockStatus;
    }

    private async generateTokens(user: IUserDocument): Promise<Tokens> {
        // Generate JWT tokens
        const userPayload: IJwtPayload = {
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
        };
        const jwtAccessToken: string = createJwtAccessToken(userPayload);
        const jwtRefreshToken: string = createJwtRefreshToken(userPayload);
        return { accessToken: jwtAccessToken, refreshToken: jwtRefreshToken };
    }

    private async sendVerificationEmail(email: string, otp: string): Promise<void> {
        const emailTemplate: IEmailTemplate = getEmailVerificationTemplate(otp);
        await sendEmail(email, emailTemplate);
    }
}
