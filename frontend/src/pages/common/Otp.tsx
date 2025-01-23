import { FormEvent, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { resendOtpApi, verifyOtpApi } from '../../api/apiMethods';
import LoaderCircle from '../../components/Loader/LoaderCircle';
import { IOtp, IOtpResponse, IResponse, UserRole } from '../../types';
import { calculateRemainingTime, checkPathIsSame, checkRole, hotToastMessage, otpSchema } from '../../utils';
import CustomButton from '../../components/Button/CustomButton';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { addOtpTokenTimer, clearOtpTokenTimer } from '../../redux/slice/otpTokenSlice';
import { Typography } from '@mui/material';

const Otp: React.FC = () => {
    const inputRef = useRef<(HTMLInputElement | null)[]>([]);
    const navigate = useNavigate();
    const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
    const [isVerificationLoading, setVerificationIsLoading] = useState<boolean>(false);
    const [isResendOtpLoading, setResendOtpIsLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<Partial<IOtp>>({});
    const location = useLocation();
    const { userId, role } = location.state;
    const otpTokenExpiry: Date | null = useAppSelector((store) => store.otpTokenReducer.otpTokenExpiry);
    const [timer, setTimer] = useState<number>(0); // Timer in seconds
    const dispatch = useAppDispatch();
    const ONE_SECOND_IN_MS: number = 1000;

    const isUser: boolean = checkRole(UserRole.USER, role);
    const isRestaurant: boolean = checkRole(UserRole.RESTAURANT, role);

    const isSignupOtpPage: boolean = checkPathIsSame(location, '/signup/otp');

    useEffect(() => {
        if (!otpTokenExpiry) return;

        // Calculate remaining time in seconds for otp resend
        const remainingTime = calculateRemainingTime(otpTokenExpiry);
        setTimer(remainingTime);

        // Start the countdown
        const countdown = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(countdown);
                    return 0;
                }
                return prev - 1;
            });
        }, ONE_SECOND_IN_MS);

        return () => clearInterval(countdown); // Cleanup interval on unmount
    }, [otpTokenExpiry]);

    const handleChange = (index: number, value: string): void => {
        if (/^[a-zA-Z0-9]$/.test(value) || value === '') {
            const otps = [...otp];
            otps[index] = value;
            setOtp(otps);
        }
        // Move to the next input field
        if (value !== '' && index < 5) {
            inputRef.current[index + 1]?.focus();
        }
    };

    // to handle backSpace
    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRef.current[index - 1]?.focus();
        }
    };

    const handleResendOtp = async (): Promise<void> => {
        // onResend(); // Trigger resend OTP functionality
        try {
            setResendOtpIsLoading(true);
            const response: IResponse = await resendOtpApi({ userId });
            hotToastMessage(response.message, 'success');
            dispatch(addOtpTokenTimer((response.data as IOtpResponse).otpOrTokenExpiresAt));
            const remainingTime: number = calculateRemainingTime(otpTokenExpiry!);
            setTimer(remainingTime);
        } catch (error: unknown) {
            hotToastMessage((error as Error).message, 'error');
        } finally {
            setResendOtpIsLoading(false);
        }
    };

    const handleSubmit = async (e: FormEvent): Promise<void> => {
        try {
            setVerificationIsLoading(true);
            e.preventDefault();
            setErrors({});

            const otpString: string = otp.join('');
            // Form validation
            const result = otpSchema.safeParse({ otp: otpString });

            if (!result.success) {
                const fieldErrors = result.error.formErrors.fieldErrors;
                setErrors(fieldErrors as Partial<IOtp>);
                return;
            }

            const response = await verifyOtpApi({ userId, otp: otpString });
            if (response.data) {
                hotToastMessage(response.message, 'success');
                dispatch(clearOtpTokenTimer());
                if (isSignupOtpPage) {
                    if (isRestaurant) {
                        navigate('/restaurant/auth');
                    }

                    if (isUser) {
                        navigate('/auth');
                    }
                }
            }
        } catch (error: unknown) {
            hotToastMessage((error as Error).message, 'error');
        } finally {
            setVerificationIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center w-full h-screen">
            <div className="flex flex-col gap-10 p-8 rounded-md border border-gray-300 mx-2">
                <div className="text-center">
                    <h1 className="font-extrabold text-2xl">Verify Email</h1>
                    <p className="text-sm text-gray-600">Enter the 6-digit code sent to your email address</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="flex gap-2 justify-center">
                        {otp &&
                            otp.map((letter: string, index: number) => (
                                <input
                                    key={index}
                                    type="text"
                                    ref={(element: HTMLInputElement | null) =>
                                        (inputRef.current[index] = element)
                                    }
                                    maxLength={1}
                                    value={letter}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        handleChange(index, e.target.value)
                                    }
                                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
                                        handleKeyDown(index, e)
                                    }
                                    className="border border-black w-10 h-10 md:h-12 md:w-12 text-center text-sm md:text-2xl font-bold rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            ))}
                    </div>
                    {errors && <Typography className="text-sm text-red-500">{errors.otp}</Typography>}
                    <div className="py-5">
                        <CustomButton type="submit" disabled={isVerificationLoading} className="w-full">
                            {isVerificationLoading ? (
                                <label className="flex items-center gap-4">
                                    Verifying... <LoaderCircle />
                                </label>
                            ) : (
                                <>Verify</>
                            )}
                        </CustomButton>
                        <div className="py-2 flex justify-end">
                            <CustomButton variant="text" onClick={handleResendOtp}>
                                {timer === 0
                                    ? `${isResendOtpLoading ? 'sending...' : 'resend otp'}`
                                    : `${timer} seconds`}
                            </CustomButton>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Otp;
