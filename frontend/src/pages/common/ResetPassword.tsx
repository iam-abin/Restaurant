import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { Link, NavigateFunction, useNavigate, useParams } from 'react-router-dom';
import { Input, Typography } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';

import { hotToastMessage, resetPasswordSchema } from '../../utils';
import { resetPasswordApi, verifyResetTokenApi } from '../../api/apiMethods';
import { IResponse, IResetPassword, IUser } from '../../types';
import LoaderCircle from '../../components/Loader/LoaderCircle';
import CustomButton from '../../components/Button/CustomButton';
import { clearOtpTokenTimer } from '../../redux/slice/otpTokenSlice';
import { useAppDispatch } from '../../redux/hooks';

type UniqueId = {
    uniqueId: string | undefined;
};
const ResetPassword: React.FC = () => {
    const navigate: NavigateFunction = useNavigate();
    const { uniqueId }: Readonly<Partial<UniqueId>> = useParams();
    const dispatch = useAppDispatch();

    const [password, setPassword] = useState<IResetPassword>({
        password: '',
        confirmPassword: '',
    });
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [user, setUser] = useState<IUser | null>(null);
    const [errors, setErrors] = useState<Partial<IResetPassword>>({});

    useEffect(() => {
        (async () => {
            try {
                const response: IResponse = await verifyResetTokenApi({
                    resetToken: uniqueId!,
                });

                if (response.data) {
                    setUser(response.data as IUser);
                }
            } catch (error: unknown) {
                hotToastMessage((error as Error).message, 'error');
            }
        })();
    }, []);

    // Handle input changes
    const changeEventHandler = (e: ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;

        setPassword((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Validate after updating the value
        const validationResult = resetPasswordSchema.safeParse({
            ...password,
            [name]: value,
        });

        if (!validationResult.success) {
            const fieldErrors = validationResult.error.formErrors.fieldErrors;
            setErrors(fieldErrors as Partial<IResetPassword>);
        } else {
            setErrors({});
        }
    };

    const handleSubmitPassword = async (e: FormEvent): Promise<void> => {
        e.preventDefault();

        if (!user) {
            hotToastMessage('invalid token', 'error');
            return;
        }
        setIsLoading(true);

        try {
            const response: IResponse = await resetPasswordApi({
                userId: user._id,
                password: password.password,
            });

            hotToastMessage(response.message, 'success');

            navigate('/auth');
        } catch (error: unknown) {
            hotToastMessage((error as Error).message, 'error');
        } finally {
            dispatch(clearOtpTokenTimer());
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen w-full">
            {/* Reset password form */}
            {user ? (
                <form onSubmit={handleSubmitPassword} className="flex flex-col md:w-2/6">
                    <div className="text-center">
                        <h1 className="font-extrabold text-2xl mb-2">Reset Password</h1>
                        <p className="text-sm text-gray-600">Enter your new password to reset the old one</p>
                    </div>
                    <div className="items-center relative">
                        <LockIcon className="ml-2 mr-2 absolute inset-y-7 pointer-events-none" />
                        <Input
                            className="w-full p-1 pl-8 border border-black mt-5"
                            type="password"
                            name="password"
                            value={password.password}
                            onChange={changeEventHandler}
                            placeholder="Enter your password"
                            autoComplete="new-password"
                        />
                        {errors.password && (
                            <Typography className="text-sm text-red-500">{errors.password}</Typography>
                        )}
                    </div>
                    <div className="items-center relative">
                        <LockIcon className="ml-2 mr-2 absolute inset-y-7 pointer-events-none" />
                        <Input
                            className="w-full p-1 pl-8 border border-black mt-5"
                            type="password"
                            name="confirmPassword"
                            value={password.confirmPassword}
                            onChange={changeEventHandler}
                            placeholder="Confirm your password"
                            autoComplete="new-password"
                        />
                        {errors.confirmPassword && (
                            <Typography className="text-sm text-red-500">{errors.confirmPassword}</Typography>
                        )}
                    </div>
                    <div className="py-5">
                        <CustomButton type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? (
                                <label className="flex items-center gap-4">
                                    Sending <LoaderCircle />
                                </label>
                            ) : (
                                <>Reset</>
                            )}
                        </CustomButton>
                    </div>
                    <Typography className="mt-5 text-center">
                        Back to{' '}
                        <Link to="/auth" className="ml-1 text-blue-500 hover:text-blue-800">
                            Login
                        </Link>
                    </Typography>
                </form>
            ) : (
                <div className="flex flex-col items-center justify-center w-full h-screen text-center">
                    <p className="text-lg font-bold">Reset token has expired</p>
                    <div className="my-5">
                        <CustomButton onClick={() => navigate('/')}>Go back to sign in</CustomButton>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResetPassword;
