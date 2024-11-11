import { Button, Input } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import Divider from "@mui/material/Divider";
import { ChangeEvent, FormEvent, useState } from "react";
import LoaderCircle from "../components/LoaderCircle";
import { signInSchema, signUpSchema } from "../utils/schema/userSchema";
import { Link } from "react-router-dom";

interface IAuthentication {
    name?: string;
    email: string;
    phone?: string;
    password: string;
}

const Auth = () => {
    const [isLogin, setIsLogin] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [input, setInput] = useState<Partial<IAuthentication>>({
        name: "",
        email: "",
        phone: "",
        password: "",
    });
    const [errors, setErrors] = useState<Partial<IAuthentication>>({});

    const changeEventHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setInput({ ...input, [name]: value });
        if (isLogin) {
            const result = signInSchema.safeParse(input);
            if (!result.success) {
                const fieldErrors = result.error.formErrors.fieldErrors;
                setErrors(fieldErrors as Partial<IAuthentication>);
                return;
            }
        } else {
            const result = signUpSchema.safeParse(input);
            if (!result.success) {
                const fieldErrors = result.error.formErrors.fieldErrors;
                setErrors(fieldErrors as Partial<IAuthentication>);
            }
        }
    };

    const handlePageSwitch = () => {
        setIsLogin((state) => !state);
    };

    const handleSubmit = (e: FormEvent) => {
        setIsLoading(true);
        e.preventDefault();
        if (Object.keys(errors).length) {
            console.log("errors", errors);
            setIsLoading(false);
            return;
        }
        if (isLogin) {
            // Form validation
            const result = signInSchema.safeParse(input);
            if (!result.success) {
                const fieldErrors = result.error.formErrors.fieldErrors;
                setErrors(fieldErrors as Partial<IAuthentication>);
                return;
            }
            // login api call
        } else {
            // Form validation
            const result = signUpSchema.safeParse(input);
            if (!result.success) {
                const fieldErrors = result.error.formErrors.fieldErrors;
                setErrors(fieldErrors as Partial<IAuthentication>);
            }
            return;
            // signup api call
        }
        console.log(input);
        setIsLoading(false);
    };

    return (
        <div className="bg-yellow-200 min-h-screen flex justify-center items-center">
            <form
                onSubmit={handleSubmit}
                className="bg-slate-200 items-center w-10/12  md:w-2/6 gap-5 p-8 border-black rounded-lg"
            >
                <div className="w-full flex flex-col gap-4 mb-10">
                    <div className="mb-4 flex justify-center ">
                        {" "}
                        <h1 className="font8-bold text-2xl">
                            Restaurant {isLogin ? "Login" : "Signup"}
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
                                placeholder="Enter your name"
                                autoComplete="name"
                            />
                            {errors && (
                                <span className="text-sm text-red-500">
                                    {errors.name}
                                </span>
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
                        {errors && (
                            <span className="text-sm text-red-500">
                                {errors.email}
                            </span>
                        )}
                    </div>
                    {!isLogin && (
                        <div className="items-center relative">
                            <PersonIcon className="mr-2 absolute inset-y-2 pointer-events-none" />

                            <Input
                                className="w-full p-1 pl-8"
                                type="text"
                                name="phone"
                                value={input.phone}
                                onChange={changeEventHandler}
                                placeholder="Enter your phone"
                                autoComplete="phone"
                            />
                            {errors && (
                                <span className="text-sm text-red-500">
                                    {errors.phone}
                                </span>
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
                        {errors && (
                            <span className="text-sm text-red-500">
                                {errors.phone}
                            </span>
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
                        "Login"
                    ) : (
                        "Signup"
                    )}
                </Button>
                <div className="flex justify-end mt-2">
                    <Link className="text-sm hover:text-blue-700" to="/forgot-password">
                        Forgot Password
                    </Link>
                </div>

                <div className="mt-5">
                    <Divider className="mt-5" />
                    <span className="text-sm flex mt-3">
                        {isLogin ? (
                            <>
                                Dont have an account?{" "}
                                <p
                                    onClick={handlePageSwitch}
                                    className="ml-1 text-blue-700 hover:text-blue-500 cursor-pointer"
                                >
                                    signup
                                </p>
                            </>
                        ) : (
                            <>
                                Already have an account?{" "}
                                <p
                                    onClick={handlePageSwitch}
                                    className="ml-1 text-blue-700 hover:text-blue-500 cursor-pointer"
                                >
                                    signin
                                </p>
                            </>
                        )}
                    </span>
                </div>
            </form>
        </div>
    );
};

export default Auth;
