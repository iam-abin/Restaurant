import { Button, Input, Typography } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import Divider from '@mui/material/Divider';
import { ChangeEvent, FormEvent, useState } from 'react';
import LoaderCircle from '../../components/Loader/LoaderCircle';
import { signInSchema, signUpSchema } from '../../utils/schema/userSchema';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ROLES_CONSTANTS } from '../../utils/constants';
import { useAppDispatch } from '../../redux/hooks';
import { signinUser } from '../../redux/thunk/authThunk';
import { hotToastMessage } from '../../utils/hotToast';
import { signupApi } from '../../api/apiMethods/auth';
import { ISignup, IUser } from '../../types';
import { fetchMyRestaurant } from '../../redux/thunk/restaurantThunk';
import { fetchUserProfile } from '../../redux/thunk/profileThunk';

const Auth = () => {
    const [isLogin, setIsLogin] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const naivgate = useNavigate();
    const location = useLocation();

    const isRestaurantPage = location.pathname.includes(ROLES_CONSTANTS.RESTAURANT);
    const isAdminPage = location.pathname.includes(ROLES_CONSTANTS.ADMIN);

    const role: string = isRestaurantPage
        ? ROLES_CONSTANTS.RESTAURANT
        : isAdminPage
          ? ROLES_CONSTANTS.ADMIN
          : ROLES_CONSTANTS.USER;

    const [input, setInput] = useState<ISignup>({
        name: '',
        email: '',
        phone: '',
        password: '',
        role,
    });
    const [errors, setErrors] = useState<Partial<ISignup>>({});

    const changeEventHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setInput({ ...input, [name]: value });
    };

    const handlePageSwitch = () => {
        setIsLogin((state) => !state);
    };

    const handleSubmit = async (e: FormEvent) => {
        try {
            e.preventDefault();
            // Clear existing errors
            setErrors({});
            setIsLoading(true);
            // Convert phone to number for validation if necessary

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

                if (role === ROLES_CONSTANTS.RESTAURANT) {
                    await dispatch(fetchMyRestaurant());
                }

                if (role === ROLES_CONSTANTS.USER) {
                    await dispatch(fetchUserProfile());
                }

                // Check if the action was rejected
                if (response.meta.requestStatus !== 'rejected') {
                    naivgate('/');
                }
            } else {
                const response = await signupApi(input);
                const data = response.data as IUser;
                if (response.data) {
                    hotToastMessage(response.message, 'success');
                    naivgate('/signup/otp', {
                        state: {
                            userId: data._id,
                            role: data.role,
                        },
                    });
                }
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-yellow-300 min-h-screen flex justify-center items-center">
            <form
                onSubmit={handleSubmit}
                className="bg-slate-200 items-center w-10/12  md:w-2/6 gap-5 p-8 border-black rounded-lg"
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
                            <PersonIcon className="mr-2 absolute inset-y-2 pointer-events-none" />

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
                        <EmailIcon className="mr-2 absolute inset-y-2 pointer-events-none" />
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
                            <LocalPhoneIcon className="mr-2 absolute inset-y-2 pointer-events-none" />

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
                        <LockIcon className="mr-2 absolute inset-y-2 pointer-events-none" />

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
                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mb-5 bg-orange-300"
                    variant="contained"
                >
                    {isLoading ? (
                        <label className="flex items-center gap-4">
                            Please wait <LoaderCircle />
                        </label>
                    ) : isLogin ? (
                        'Login'
                    ) : (
                        'Signup'
                    )}
                </Button>
                {!isAdminPage && (
                    <div className="flex justify-end mt-2">
                        <Link className="text-sm hover:text-blue-700" to="/forgot-password/email">
                            Forgot Password
                        </Link>
                    </div>
                )}

                {!isAdminPage && (
                    <div className="mt-5">
                        <Divider className="mt-5" />
                        <Typography className="text-sm flex mt-3">
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
    );
};

export default Auth;