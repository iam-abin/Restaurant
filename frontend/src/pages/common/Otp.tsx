import { FormEvent, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { verifyOtpApi } from '../../api/apiMethods';
import { hotToastMessage } from '../../utils/hotToast';
import LoaderCircle from '../../components/Loader/LoaderCircle';
import { UserRole } from '../../types';
import { checkPathIsSame, checkRole } from '../../utils';
import CustomButton from '../../components/Button/CustomButton';

const Otp: React.FC = () => {
    const inputRef = useRef<(HTMLInputElement | null)[]>([]);
    const navigate = useNavigate();
    const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const location = useLocation();
    const { userId, role } = location.state;

    const isUser: boolean = checkRole(UserRole.USER, role);
    const isRestaurant: boolean = checkRole(UserRole.RESTAURANT, role);

    const isSignupOtpPage: boolean = checkPathIsSame(location, '/signup/otp');
    const isForgotPasswordEmailOtpPage: boolean = checkPathIsSame(location, '/forgot-password/otp');

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

    const handleSubmit = async (e: FormEvent): Promise<void> => {
        try {
            setIsLoading(true);
            e.preventDefault();
            if (otp.length < 6 || otp.length > 6) {
                return;
            }

            const otpString = otp.join('');
            const response = await verifyOtpApi({ userId, otp: otpString });
            if (response.data) {
                hotToastMessage(response.message, 'success');
                if (isSignupOtpPage) {
                    if (isRestaurant) {
                        navigate('/restaurant/auth');
                    }

                    if (isUser) {
                        navigate('/auth');
                    }
                }

                if (isForgotPasswordEmailOtpPage) {
                    navigate('/reset-password', { state: { userId } });
                }
            }
        } finally {
            setIsLoading(false);
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
                    <div className="py-5">
                        <CustomButton type="submit" disabled={isLoading} className="w-full">
                            {isLoading ? (
                                <label className="flex items-center gap-4">
                                    Verifying... <LoaderCircle />
                                </label>
                            ) : (
                                <>Verify</>
                            )}
                        </CustomButton>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Otp;
