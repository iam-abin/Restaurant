import { Input, Typography } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import { ChangeEvent, FormEvent, useState } from 'react';
import { emailSchema, hotToastMessage } from '../../utils';
import LoaderCircle from '../../components/Loader/LoaderCircle';
import { Link, useNavigate } from 'react-router-dom';
import { ForgotPasswordEmailApi } from '../../api/apiMethods';
import { IResponse } from '../../types/api';
import { ISignupResponse } from '../../types';
import CustomButton from '../../components/Button/CustomButton';
import { useAppDispatch } from '../../redux/hooks';
import { addOtpTokenTimer } from '../../redux/slice/otpTokenSlice';

export interface IForgotPasswordEmail {
    email: string;
}

const ForgotPasswordEmail: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<Partial<IForgotPasswordEmail>>({});
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const changeEventHandler = (e: ChangeEvent<HTMLInputElement>): void => {
        setEmail(e.target.value);
        const result = emailSchema.safeParse(email);
        if (!result.success) {
            const fieldErrors = result.error.formErrors.fieldErrors;
            setErrors(fieldErrors as Partial<IForgotPasswordEmail>);
            return;
        }
    };

    const handleSubmit = async (e: FormEvent): Promise<void> => {
        e.preventDefault();

        setErrors({});

        if (Object.keys(errors).length) {
            return;
        }
        // Form validation
        const result = emailSchema.safeParse({ email });

        if (!result.success) {
            const fieldErrors = result.error.formErrors.fieldErrors;
            setErrors(fieldErrors as Partial<IForgotPasswordEmail>);
            return;
        }
        try {
            setIsLoading(true);
            const response: IResponse = await ForgotPasswordEmailApi({ email });
            const { user, otpOrTokenExpiresAt } = response.data as ISignupResponse;
            dispatch(addOtpTokenTimer(otpOrTokenExpiresAt));
            if (user) {
                hotToastMessage(response.message, 'success');
                setEmail('');
                navigate('/forgot-password/resetlink-sended', {
                    state: { email: user.email },
                });
            }
        } catch (error: unknown) {
            hotToastMessage((error as Error).message, 'error');
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="flex items-center justify-center min-h-screen w-full">
            <form onSubmit={handleSubmit} className="flex flex-col  w-10/12  md:w-2/6 ">
                <div className="text-center">
                    <h1 className="font-extrabold text-2xl mb-2">Forgot Password</h1>
                    <p className="text-sm text-gray-600">Enter your email address to reset your password</p>
                </div>
                <div className="items-center relative">
                    <EmailIcon className="ml-2 mr-2 absolute inset-y-7 pointer-events-none" />
                    <Input
                        className="w-full p-1 pl-8  border border-black mt-5"
                        type="text"
                        name="email"
                        value={email}
                        onChange={changeEventHandler}
                        placeholder="Enter your email"
                        autoComplete="email"
                    />
                    {errors && <Typography className="text-sm text-red-500">{errors.email}</Typography>}
                </div>
                <div className="py-5">
                    <CustomButton type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                            <label className="flex items-center gap-4">
                                Sending <LoaderCircle />
                            </label>
                        ) : (
                            <>Send Reset Lint</>
                        )}
                    </CustomButton>
                </div>
                <Typography className="mt-5 text-center">
                    Back to
                    <Link to="/auth" className="ml-1 text-blue-500 hover:text-blue-800">
                        Login
                    </Link>
                </Typography>
            </form>
        </div>
    );
};

export default ForgotPasswordEmail;
