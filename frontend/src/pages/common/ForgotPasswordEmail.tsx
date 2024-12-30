import { Button, Input, Typography } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import { ChangeEvent, FormEvent, useState } from 'react';
import { emailSchema } from '../../utils/schema/userSchema';
import LoaderCircle from '../../components/Loader/LoaderCircle';
import { Link, useNavigate } from 'react-router-dom';
import { ForgotPasswordEmailApi } from '../../api/apiMethods';
import { IResponse } from '../../types/api';
import { hotToastMessage } from '../../utils/hotToast';
import { IUser } from '../../types';

export interface IForgotPasswordEmail {
    email: string;
}

const ForgotPasswordEmail = () => {
    const [email, setEmail] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<Partial<IForgotPasswordEmail>>({});
    const navigate = useNavigate();

    const changeEventHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        const result = emailSchema.safeParse(email);
        if (!result.success) {
            const fieldErrors = result.error.formErrors.fieldErrors;
            setErrors(fieldErrors as Partial<IForgotPasswordEmail>);
            return;
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        setErrors({});

        if (Object.keys(errors).length) {
            console.log('errors', errors);
            return;
        }
        // Form validation
        const result = emailSchema.safeParse({ email });

        if (!result.success) {
            console.log('result submit', result);
            console.log('email submit', email);
            const fieldErrors = result.error.formErrors.fieldErrors;
            setErrors(fieldErrors as Partial<IForgotPasswordEmail>);
            return;
        }
        try {
            setIsLoading(true);
            const response: IResponse = await ForgotPasswordEmailApi({ email });
            const userData = response.data as IUser;
            if (userData) {
                hotToastMessage(response.message, 'success');
                setEmail('');
                navigate('/forgot-password/otp', {
                    state: { userId: userData._id, role: userData.role },
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
                <Button
                    type="submit"
                    disabled={isLoading}
                    // className="w-full mb-5"
                    sx={{
                        width: '100%',
                        mt: 2,
                        backgroundColor: isLoading ? 'orange' : '#FF8C00',
                        '&:hover': {
                            backgroundColor: isLoading ? 'orange' : '#FF8C00',
                        },
                    }}
                    variant="contained"
                >
                    {isLoading ? (
                        <label className="flex items-center gap-4">
                            Sending <LoaderCircle />
                        </label>
                    ) : (
                        <>Send otp</>
                    )}
                </Button>

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
