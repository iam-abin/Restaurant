import { Button, Input, Typography } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import { ChangeEvent, FormEvent, useState } from "react";
import { emailSchema } from "../utils/schema/userSchema";
import LoaderCircle from "../components/Loader/LoaderCircle";
import { Link, useNavigate } from "react-router-dom";

interface IForgotPassword {
    password: string;
}

const ResetPassword = () => {
    const navigate = useNavigate();
    const [password, setPassword] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<Partial<IForgotPassword>>({});

    const changeEventHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        const result = emailSchema.safeParse(password);
        if (!result.success) {
            const fieldErrors = result.error.formErrors.fieldErrors;
            setErrors(fieldErrors as Partial<IForgotPassword>);
            return;
        }
    };

    const handleSubmit = (e: FormEvent) => {
        setIsLoading(true);
        e.preventDefault();
        if (Object.keys(errors).length) {
            console.log("errors", errors);
            setIsLoading(false);
            return;
        }
        setIsLoading(false);
        navigate("/login");
    };
    return (
        <div className="flex items-center justify-center min-h-screen w-full">
            <form onSubmit={handleSubmit} className="flex flex-col md:w-2/6">
                <div className="text-center">
                    <h1 className="font-extrabold text-2xl mb-2">
                        Reset Password
                    </h1>
                    <p className="text-sm text-gray-600">
                        Enter your new password to reset old one
                    </p>
                </div>
                    <div className="items-center relative">
                        <LockIcon className="ml-2 mr-2 absolute inset-y-7 pointer-events-none" />
                        <Input
                            className="w-full p-1 pl-8  border border-black mt-5"
                            type="password"
                            name="password"
                            value={password}
                            onChange={changeEventHandler}
                            placeholder="Enter your password"
                            autoComplete="password"
                        />
                        {errors && (
                            <Typography className="text-sm text-red-500">
                                {errors.password}
                            </Typography>
                        )}
                    </div>
                <Button
                    type="submit"
                    disabled={isLoading}
                    // className="w-full mb-5"
                    sx={{
                        width: '100%',
                        mt: 2, 
                        backgroundColor:  isLoading ? 'orange' : '#FF8C00',
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
                        <>Reset</>
                    )}
                </Button>

                <Typography className="mt-5 text-center">Back to 
                    <Link to="/auth" className="ml-1 text-blue-500 hover:text-blue-800">Login</Link>
                </Typography>
            </form>
        </div>
    );
};

export default ResetPassword;
