import { autoInjectable } from 'tsyringe';
import { IOtp, IUser } from '../database/model';
import { UserSignInDto, UserSignupDto } from '../dto/auth.dto';
import { BadRequestError, NotAuthorizedError, NotFoundError } from '../errors';
import { comparePassword, createJwtAccessToken, IJwtPayload, sendConfirmationEmail } from '../utils';
import { OtpRepository, UserRepository } from '../database/repository';
import mongoose from 'mongoose';
import { generateOtp } from '../utils/otp';

@autoInjectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly otpRepository: OtpRepository,
    ) {}

    public async signUp(userRegisterDto: UserSignupDto): Promise<IUser | null> {
        const { email } = userRegisterDto;
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const existingUser: IUser | null = await this.userRepository.findByEmail(email);
            // If the user already exists but is not verified
            if (existingUser && !existingUser.isVerified) {
                const otp: string = generateOtp();
                const savedOtp: IOtp = await this.otpRepository.createOtp(
                    {
                        userId: existingUser._id as string,
                        otp,
                    },
                    session,
                );

                // Update if user enter new name or password
                const updatedUser: IUser | null = await this.userRepository.updateUser(
                    existingUser._id as string,
                    userRegisterDto,
                    session,
                );

                await sendConfirmationEmail(email, savedOtp.otp);
                // Commit the transaction
                await session.commitTransaction();
                session.endSession();
                return updatedUser;
            }

            // If the user is already verified, throw an error
            if (existingUser) throw new BadRequestError('User already exists');

            // Create a new user and generate OTP and send confirmation email
            const user = await this.userRepository.createUser(userRegisterDto, session);
            const otp: string = generateOtp();
            const savedOtp = await this.otpRepository.createOtp({ userId: user._id as string, otp }, session);
            await sendConfirmationEmail(email, savedOtp.otp);

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

    public async signIn(userSignInDto: UserSignInDto): Promise<{ user: IUser; accessToken: string }> {
        const { email, password } = userSignInDto;

        // Check if the user exists
        const existingUser: IUser | null = await this.userRepository.findByEmail(email);
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
        };
        const jwt: string = createJwtAccessToken(userPayload);

        return { user: existingUser, accessToken: jwt };
    }

    public async getProfile(userId: string): Promise<IUser | null> {
        const user: IUser | null = await this.userRepository.findUserById(userId);
        if (!user) throw new NotFoundError('This user does not exist');
        return user;
    }
}
