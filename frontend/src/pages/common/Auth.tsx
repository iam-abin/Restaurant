import { ChangeEvent, FormEvent, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Input, Typography, Divider } from '@mui/material';
import { Email, Person, Lock, LocalPhone } from '@mui/icons-material';

import { hotToastMessage, signInSchema, signUpSchema, checkRole, getRoleFromPath } from '../../utils';
import { useAppDispatch } from '../../redux/hooks';
import { googleAuthThunk, signinUser } from '../../redux/thunk/authThunk';
import { signupApi } from '../../api/apiMethods';
import LoaderCircle from '../../components/Loader/LoaderCircle';

import { ISignup, ISignupResponse, UserRole } from '../../types';

import { fetchMyRestaurant } from '../../redux/thunk/restaurantThunk';
import { fetchUserProfile } from '../../redux/thunk/profileThunk';

import AuthRestaurantImage from '../../assets/auth/auth-restaurant.png';
import AuthUserImage from '../../assets/auth/auth-user.png';
import AuthAdminImage from '../../assets/auth/auth-admin.png';

import {
    CredentialResponse,
    GoogleLogin,
    //  useGoogleLogin
} from '@react-oauth/google';
import CustomButton from '../../components/Button/CustomButton';
import { addOtpTokenTimer } from '../../redux/slice/otpTokenSlice';

const Auth: React.FC = () => {
    const [isLogin, setIsLogin] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const naivgate = useNavigate();
    const location = useLocation();

    const isRestaurantPage: boolean = getRoleFromPath(UserRole.RESTAURANT, location);
    const isAdminPage: boolean = getRoleFromPath(UserRole.ADMIN, location);

    const role: UserRole = isRestaurantPage
        ? UserRole.RESTAURANT
        : isAdminPage
          ? UserRole.ADMIN
          : UserRole.USER;

    const [input, setInput] = useState<ISignup>({
        name: '',
        email: '',
        phone: '',
        password: '',
        role,
    });
    const [errors, setErrors] = useState<Partial<ISignup>>({});

    const changeEventHandler = (e: ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setInput({ ...input, [name]: value });
    };

    const handlePageSwitch = (): void => {
        setIsLogin((state) => !state);
    };

    const handleSubmit = async (e: FormEvent): Promise<void> => {
        try {
            e.preventDefault();
            // Clear existing errors
            setErrors({});
            setIsLoading(true);

            const filteredData = Object.fromEntries(Object.entries(input).filter(([, value]) => value));
            const inputData = {
                ...input,
                phone: input.phone ? Number(input.phone) : undefined,
            };

            // Form validation
            const result = isLogin ? signInSchema.safeParse(filteredData) : signUpSchema.safeParse(inputData);

            if (!result.success) {
                const fieldErrors = result.error.formErrors.fieldErrors;
                setErrors(fieldErrors as Partial<ISignup>);
                return;
            }
            if (isLogin) {
                const response = await dispatch(
                    signinUser({
                        email: input.email!,
                        password: input.password!,
                        role: role!,
                    }),
                );
                if (response.meta.requestStatus === 'rejected') {
                    return;
                }

                if (checkRole(UserRole.RESTAURANT, role)) {
                    await dispatch(fetchMyRestaurant());
                }

                if (checkRole(UserRole.USER, role)) {
                    await dispatch(fetchUserProfile());
                }

                naivgate('/');
            } else {
                const response = await signupApi(input);
                const { user, otpOrTokenExpiresAt } = response.data as ISignupResponse;
                dispatch(addOtpTokenTimer(otpOrTokenExpiresAt));
                if (response.data) {
                    hotToastMessage(response.message, 'success');
                    naivgate('/signup/otp', {
                        state: {
                            userId: user._id,
                            role: user.role,
                        },
                    });
                }
            }
        } catch (error: unknown) {
            hotToastMessage((error as Error).message, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // google login
    const handleSuccess = async (googleResponse: CredentialResponse): Promise<void> => {
        const { credential } = googleResponse;
        const response = await dispatch(googleAuthThunk({ credential: credential!, role }));
        // Check if the action was rejected
        if (response.meta.requestStatus !== 'rejected') {
            naivgate('/');
        } else {
            hotToastMessage(response.payload as string, 'error');
        }
    };

    const handleError = (): void => {
        hotToastMessage('Login failed', 'error');
    };

    return (
        <div className="bg-gray-300 min-h-screen flex justify-center items-center">
            <div className="md:w-1/2 flex h-screen justify-center items-center">
                <form
                    onSubmit={handleSubmit}
                    className="bg-slate-200 items-center justify-center max-h-5/6 w-11/12 md:w-8/12 gap-5 p-8 border-black rounded-lg"
                >
                    <div className="w-full flex flex-col gap-4 mb-10">
                        <div className="mb-4 flex justify-center ">
                            {' '}
                            <h1 className="font8-bold text-2xl">
                                {role} {isLogin ? 'Login' : 'Signup'}
                            </h1>
                        </div>
                        {!isLogin && (
                            <div className="items-center relative">
                                <Person className="mr-2 absolute inset-y-2 pointer-events-none" />

                                <Input
                                    className="w-full p-1 pl-8"
                                    type="text"
                                    name="name"
                                    value={input.name}
                                    onChange={changeEventHandler}
                                    placeholder={`Enter your ${isRestaurantPage ? 'restaurant' : ''}name`}
                                    autoComplete="name"
                                />
                                {errors.name && (
                                    <Typography className="text-sm text-red-500">{errors.name}</Typography>
                                )}
                            </div>
                        )}
                        <div className="items-center relative">
                            <Email className="mr-2 absolute inset-y-2 pointer-events-none" />
                            <Input
                                className="w-full p-1 pl-8"
                                type="text"
                                name="email"
                                value={input.email}
                                onChange={changeEventHandler}
                                placeholder="Enter your email"
                                autoComplete="email"
                            />
                            {errors.email && (
                                <Typography className="text-sm text-red-500">{errors.email}</Typography>
                            )}
                        </div>
                        {!isLogin && (
                            <div className="items-center relative">
                                <LocalPhone className="mr-2 absolute inset-y-2 pointer-events-none" />

                                <Input
                                    className="w-full p-1 pl-8"
                                    type="text"
                                    name="phone"
                                    value={input.phone}
                                    onChange={changeEventHandler}
                                    placeholder="Enter your phone"
                                    autoComplete="phone"
                                />
                                {errors.phone && (
                                    <Typography className="text-sm text-red-500">{errors.phone}</Typography>
                                )}
                            </div>
                        )}
                        <div className=" items-center relative">
                            <Lock className="mr-2 absolute inset-y-2 pointer-events-none" />

                            <Input
                                className="p-1 pl-8 bg-none w-full"
                                type="password"
                                name="password"
                                value={input.password}
                                onChange={changeEventHandler}
                                placeholder="Enter your password"
                                autoComplete="password"
                            />
                            {errors.password && (
                                <Typography className="text-sm text-red-500">{errors.password}</Typography>
                            )}
                        </div>
                    </div>
                    <CustomButton type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                            <label className="flex items-center gap-4">
                                Please wait <LoaderCircle />
                            </label>
                        ) : isLogin ? (
                            'Login'
                        ) : (
                            'Signup'
                        )}
                    </CustomButton>

                    {!isAdminPage && (
                        <div className="flex justify-end mt-2">
                            <Link className="text-sm hover:text-blue-700" to="/forgot-password/email">
                                Forgot Password
                            </Link>
                        </div>
                    )}
                    {!isAdminPage && (
                        <div className="flex justify-center items-center p-3">
                            <Divider className="mt-5 mb-5 bg-red-500" />
                            <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
                        </div>
                    )}

                    {!isAdminPage && (
                        <div className="mt-5">
                            <Divider className="mt-5" />
                            <Typography variant="caption" component={'h1'} className="text-sm flex mt-3">
                                {isLogin ? (
                                    <>
                                        Dont have an account?{' '}
                                        <p
                                            onClick={handlePageSwitch}
                                            className="ml-1 text-blue-700 hover:text-blue-500 cursor-pointer"
                                        >
                                            signup
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        Already have an account?{' '}
                                        <p
                                            onClick={handlePageSwitch}
                                            className="ml-1 text-blue-700 hover:text-blue-500 cursor-pointer"
                                        >
                                            signin
                                        </p>
                                    </>
                                )}
                            </Typography>
                        </div>
                    )}
                </form>
            </div>
            <div className="md:w-1/2 hidden md:block">
                <img
                    src={
                        isRestaurantPage ? AuthRestaurantImage : isAdminPage ? AuthAdminImage : AuthUserImage
                    }
                />
            </div>
        </div>
    );
};

export default Auth;
