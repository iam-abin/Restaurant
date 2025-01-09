import { autoInjectable } from 'tsyringe';

import { BadRequestError, ForbiddenError, NotFoundError } from '../errors';
import {
    isOtpResendAllowed,
    generateOtp,
    comparePassword,
    createJwtAccessToken,
    sendEmail,
    verifyJwtRefreshToken,
    createJwtRefreshToken,
    verifyGoogleCredentialToken,
    executeTransaction,
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
    UserRole,
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
        return executeTransaction(async (session) => {
            const { name, email } = userRegisterDto;
            const existingUser: IUserDocument | null = await this.userRepository.findUserByEmail(email);
            // If the user already exists but is not verified
            if (existingUser && !existingUser.isVerified) {
                // Check if an OTP already exists and hasn't expired (optional, based on use case)
                const existingOtp: IOtpTokenDocument | null = await this.otpTokenRepository.findByUserId(
                    existingUser._id.toString(),
                );
                if (existingOtp) {
                    const isResendTimeLimitCompleted = isOtpResendAllowed(existingOtp.createdAt);
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

                await this.sendVerificationEmail(name, email, otp);

                return updatedUser;
            }

            // If the user is already verified, throw an error
            if (existingUser) throw new BadRequestError('User already exists');

            // Create a new user and generate OTP and send confirmation email
            const user: IUserDocument = await this.userRepository.createUser(userRegisterDto, session);
            const otp: string = generateOtp();
            await this.otpTokenRepository.create({ userId: user._id.toString(), otp }, session);

            await this.sendVerificationEmail(name, email, otp);

            return user;
        });
    }

    public async signIn(
        userSignInDto: ISignin,
    ): Promise<{ user: IUserDocument; jwtAccessToken: string; jwtRefreshToken: string }> {
        const { email, password, role } = userSignInDto;

        const existingUser: IUserDocument | null = await this.userRepository.findUserByEmail(email);
        if (!existingUser) throw new BadRequestError('Invalid email or password');

        // Check if the user is signedup using google
        if (existingUser.googleId) throw new BadRequestError('use another way to login');
        if (existingUser.role !== role) throw new BadRequestError('Role is not matching');

        if (role === UserRole.ADMIN) {
            if (email !== existingUser.email && password !== existingUser.password)
                throw new BadRequestError('Invalid email or password');
        } else {
            if (existingUser.isBlocked) throw new ForbiddenError('You are a blocked user');
            const isSamePassword: boolean = await comparePassword(password!, existingUser.password!);
            if (!isSamePassword) throw new BadRequestError('Invalid email or password');

            // Check if the user is verified
            if (!existingUser.isVerified) {
                throw new ForbiddenError(
                    'You are not verified yet. Pleas verify by signup again to get otp.',
                );
            }
        }

        const { jwtAccessToken, jwtRefreshToken }: Tokens = await this.generateTokens(existingUser);
        return { user: existingUser, jwtAccessToken, jwtRefreshToken };
    }

    public async googleAuth(
        authCredential: IGoogleAuthCredential,
    ): Promise<{ user: IUserDocument; jwtAccessToken: string; jwtRefreshToken: string }> {
        const { credential, role } = authCredential;
        return executeTransaction(async (session) => {
            const { name, email, picture, email_verified, sub }: DecodedGoogleToken =
                await verifyGoogleCredentialToken(credential);

            if (!email_verified) throw new ForbiddenError('Email is not verified');

            // Check if the user exists
            const existingUser: IUserDocument | null = await this.userRepository.findUserByEmail(email);
            if (!existingUser) {
                const userData: Omit<IGoogleAuth, 'picture'> = {
                    name,
                    email,
                    imageUrl: picture,
                    role,
                    googleId: sub,
                };

                // Create a new user
                const user: IUserDocument = await this.userRepository.createUser(
                    { ...userData, isVerified: true },
                    session,
                );

                const userId: string = user._id.toString();
                if (user.role === UserRole.USER) {
                    await this.profileRepository.create({ userId, imageUrl: picture }, session);
                } else if (user.role === UserRole.RESTAURANT) {
                    await this.restaurantRepository.create({ ownerId: userId, imageUrl: picture }, session);
                }

                const { jwtAccessToken, jwtRefreshToken }: Tokens = await this.generateTokens(user);

                return { user, jwtAccessToken, jwtRefreshToken };
            }

            // Check if the user is loggedin using google
            if (!existingUser.googleId) throw new BadRequestError('use another way to login');
            if (existingUser.role !== role) throw new BadRequestError('Role is not matching');
            if (existingUser.isBlocked) throw new ForbiddenError('You are a blocked user');

            if (role === UserRole.RESTAURANT) {
                const restaurant: IRestaurantDocument | null =
                    await this.restaurantRepository.findMyRestaurant(existingUser._id.toString());
                if (restaurant?.imageUrl !== picture) {
                    await this.restaurantRepository.update(existingUser._id.toString(), {
                        imageUrl: picture,
                    });
                }
            } else if (role === UserRole.USER) {
                const profile: IProfileDocument | null = await this.profileRepository.findByUserId(
                    existingUser._id.toString(),
                );
                if (profile?.imageUrl !== picture) {
                    await this.profileRepository.update(existingUser._id.toString(), { imageUrl: picture });
                }
            }

            const { jwtAccessToken, jwtRefreshToken }: Tokens = await this.generateTokens(existingUser);

            return { user: existingUser, jwtAccessToken, jwtRefreshToken };
        });
    }

    public async jwtRefresh(jwtRefreshToken: string | undefined): Promise<{ jwtAccessToken: string }> {
        if (!jwtRefreshToken) throw new NotFoundError('RefreshToken not found');
        const { userId }: IJwtPayload = verifyJwtRefreshToken(jwtRefreshToken);
        const user = await this.userRepository.findUserById(userId);
        if (!user) throw new NotFoundError('This user does not exist');

        // Generate JWT
        const { jwtAccessToken }: Tokens = await this.generateTokens(user);
        return { jwtAccessToken };
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
        return { jwtAccessToken: jwtAccessToken, jwtRefreshToken: jwtRefreshToken };
    }

    private async sendVerificationEmail(name: string, email: string, otp: string): Promise<void> {
        const emailTemplate: IEmailTemplate = getEmailVerificationTemplate(name, otp);
        await sendEmail(email, emailTemplate);
    }
}
