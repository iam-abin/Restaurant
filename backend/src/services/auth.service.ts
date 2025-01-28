import { autoInjectable } from 'tsyringe';
import { BadRequestError, ForbiddenError, NotFoundError } from '../errors';
import {
    isOtpTOkenResendAllowed,
    generateOtp,
    comparePassword,
    createJwtAccessToken,
    sendEmail,
    verifyJwtRefreshToken,
    createJwtRefreshToken,
    verifyGoogleCredentialToken,
    executeTransaction,
    checkIsOtpTokenExpired,
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
    ISigninData,
    ISignupData,
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

    public signUp = async (userRegisterDto: ISignup): Promise<ISignupData | null> => {
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
                    const isExpired: boolean = checkIsOtpTokenExpired(existingOtp?.expiresAt);
                    if (!isExpired) {
                        const isResendTimeLimitCompleted = isOtpTOkenResendAllowed(existingOtp.createdAt);
                        if (!isResendTimeLimitCompleted) {
                            throw new BadRequestError(
                                'OTP has been recently sent. Please wait a minute before requesting again.',
                            );
                        } else {
                            await this.otpTokenRepository.deleteById(existingOtp._id.toString(), session);
                        }
                    }
                }

                const otp: string = generateOtp();
                const otpResponse: IOtpTokenDocument = await this.otpTokenRepository.create(
                    { userId: existingUser._id.toString(), otp },
                    session,
                );

                // Update if user enter new name or password
                const updatedUser: IUserDocument | null = await this.userRepository.updateUser(
                    existingUser._id.toString(),
                    userRegisterDto,
                    session,
                );

                if (!updatedUser) throw new BadRequestError('User update failed');

                await this.sendVerificationEmail(name, email, otp);

                return { user: updatedUser, otpOrTokenExpiresAt: otpResponse.expiresAt };
            }

            // If the user is already verified, throw an error
            if (existingUser) throw new BadRequestError('User already exists');

            // Create a new user and generate OTP and send confirmation email
            const user: IUserDocument = await this.userRepository.createUser(userRegisterDto, session);
            const otp: string = generateOtp();
            const otpResponse: IOtpTokenDocument = await this.otpTokenRepository.create(
                { userId: user._id.toString(), otp },
                session,
            );

            await this.sendVerificationEmail(name, email, otp);
            return { user, otpOrTokenExpiresAt: otpResponse.expiresAt };
        });
    };

    public signIn = async (userSignInDto: ISignin): Promise<ISigninData> => {
        const { email, password, role } = userSignInDto;
        const existingUser: IUserDocument | null = await this.userRepository.findUserByEmail(email);
        if (!existingUser) throw new BadRequestError('Invalid email or password');

        // Check if the user is signedup using google
        if (existingUser.googleId) throw new BadRequestError('use another way to login');
        if (existingUser.role !== role) throw new BadRequestError('Role is not matching');

        if (role === UserRole.ADMIN) {
            if (email !== existingUser.email || password !== existingUser.password)
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
    };

    public googleAuth = async (authCredential: IGoogleAuthCredential): Promise<ISigninData> => {
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
                    await this.profileRepository.createProfile({ userId, imageUrl: picture }, session);
                } else if (user.role === UserRole.RESTAURANT) {
                    await this.restaurantRepository.createRestaurant(
                        { ownerId: userId, imageUrl: picture },
                        session,
                    );
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
                    await this.restaurantRepository.findRestaurantByOwnerId(existingUser._id.toString());
                if (restaurant?.imageUrl !== picture) {
                    await this.restaurantRepository.updateRestaurant(existingUser._id.toString(), {
                        imageUrl: picture,
                    });
                }
            } else if (role === UserRole.USER) {
                const profile: IProfileDocument | null = await this.profileRepository.findProfileByUserId(
                    existingUser._id.toString(),
                );
                if (profile?.imageUrl !== picture) {
                    await this.profileRepository.updateProfile(existingUser._id.toString(), {
                        imageUrl: picture,
                    });
                }
            }

            const { jwtAccessToken, jwtRefreshToken }: Tokens = await this.generateTokens(existingUser);

            return { user: existingUser, jwtAccessToken, jwtRefreshToken };
        });
    };

    public jwtRefresh = async (jwtRefreshToken: string | undefined): Promise<{ jwtAccessToken: string }> => {
        if (!jwtRefreshToken) throw new BadRequestError('Token refresh failed, signin again!');
        const { userId }: IJwtPayload = verifyJwtRefreshToken(jwtRefreshToken);
        const user: IUserDocument | null = await this.userRepository.findUserById(userId);
        if (!user) throw new NotFoundError('This user does not exist');

        // Generate JWT
        const { jwtAccessToken }: Tokens = await this.generateTokens(user);
        return { jwtAccessToken };
    };

    public updateBlockStatus = async (userId: string): Promise<IUserDocument | null> => {
        const user: IUserDocument | null = await this.userRepository.findUserById(userId);
        if (!user) throw new NotFoundError('This user does not exist');

        const userWithUpdatedBlockStatus: IUserDocument | null = await this.userRepository.updateUser(
            userId,
            {
                isBlocked: !user.isBlocked,
            },
        );
        return userWithUpdatedBlockStatus;
    };

    private generateTokens = async (user: IUserDocument): Promise<Tokens> => {
        // Generate JWT tokens
        const userPayload: IJwtPayload = {
            userId: user._id.toString(),
            role: user.role,
        };
        const jwtAccessToken: string = createJwtAccessToken(userPayload);
        const jwtRefreshToken: string = createJwtRefreshToken(userPayload);
        return { jwtAccessToken: jwtAccessToken, jwtRefreshToken: jwtRefreshToken };
    };

    private sendVerificationEmail = async (name: string, email: string, otp: string): Promise<void> => {
        const emailTemplate: IEmailTemplate = getEmailVerificationTemplate(name, otp);
        await sendEmail(email, emailTemplate);
    };
}
