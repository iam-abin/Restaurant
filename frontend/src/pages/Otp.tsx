import { Button } from "@mui/material";
import { FormEvent, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoaderCircle from "../components/LoaderCircle";

const Otp = () => {
    const inputRef = useRef<any>([]);
    const navigate = useNavigate();
    const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const handleChange = (index: number, value: string) => {
        if (/^[a-zA-Z0-9]$/.test(value) || value === "") {
            const otps = [...otp];
            otps[index] = value;
            setOtp(otps);
        }
        // Move to the next input field
        if (value !== "" && index < 5) {
            inputRef.current[index + 1].focus();
        }
    };

    // to handle backSpace
    const handleKeyDown = (
        index: number,
        e: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRef.current[index - 1].focus();
        }
    };

    const handleSubmit = (e: FormEvent) => {
        setIsLoading(true);
        e.preventDefault();
        // if (Object.keys(errors).length) {
        //     console.log("errors", errors);
        //     setIsLoading(false);
        //     return;
        // }
        setIsLoading(false);
        navigate("/auth");
    };

    return (
        <div className="flex items-center justify-center w-full h-screen">
            <div className="flex flex-col gap-10 p-8 rounded-md border border-gray-300 mx-2">
                <div className="text-center">
                    <h1 className="font-extrabold text-2xl">verify email</h1>
                    <p className="text-sm text-gray-600">
                        Enter the 6 digit code sent to your email address
                    </p>
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
                                    value={letter[index]}
                                    onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                    ) => handleChange(index, e.target.value)}
                                    onKeyDown={(
                                        e: React.KeyboardEvent<HTMLInputElement>
                                    ) => handleKeyDown(index, e)}
                                    className="border border-black w-10 h-10 md:h-12 md:w-12 text-center text-sm md:text-2xl md: font-bold rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            ))}
                    </div>
                    <Button
                        type="submit"
                        disabled={isLoading}
                        // className="w-full mb-5"
                        sx={{
                            width: "100%",
                            mt: 2,
                            backgroundColor: isLoading ? "orange" : "#FF8C00",
                            "&:hover": {
                                backgroundColor: isLoading
                                    ? "orange"
                                    : "#FF8C00",
                            },
                        }}
                        variant="contained"
                    >
                        {isLoading ? (
                            <label className="flex items-center gap-4">
                                Verifying <LoaderCircle />
                            </label>
                        ) : (
                            <>Verify</>
                        )}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default Otp;