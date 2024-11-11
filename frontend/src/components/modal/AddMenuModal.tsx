import { ChangeEvent, FormEvent, useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import LoaderCircle from "../LoaderCircle";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    height: "80%",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
};

export default function AddMenuModal({
    isOpen,
    handleClose,
}: {
    isOpen: boolean;
    handleClose: () => void;
}) {
    const [isLoading, setIsLoading] = useState(false);
    const [input, setInput] = useState<MenuFormSchema>({
        name: "",
        description: "",
        price: 0,
        image: undefined,
    });

    const submitHandler = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    };
    const changeEventHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setInput({
            ...input,
            [name]: type === "number" ? Number(value) : value,
        });
    };

    return (
        <div>
            <Modal
                keepMounted
                open={isOpen}
                onClose={handleClose}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
            >
                <Box sx={style}>
                    {/* Close button at the top-right corner */}
                    <IconButton
                        sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                        }}
                        onClick={handleClose}
                    >
                        <CloseIcon />
                    </IconButton>
                    <div className="flex justify-center">
                        <Typography
                            id="keep-mounted-modal-title"
                            variant="h6"
                            component="h2"
                        >
                            Add A New Menu
                        </Typography>
                    </div>
                    <Typography
                        id="keep-mounted-modal-description"
                        sx={{ mt: 2 }}
                    >
                        Create a menu that will make your restaurant stand out.
                    </Typography>
                    {/* Form */}
                    <form
                        onSubmit={submitHandler}
                        className="mt-4 flex flex-col"
                    >
                        <div>
                            <label className="text-sm">Fullname</label>
                            <input
                                className="h-8 w-full bg-yellow-300 rounded-lg px-3 py-2"
                                type="text"
                                name="name"
                                placeholder="Enter menu name"
                                value={input.name}
                                onChange={changeEventHandler}
                            />
                        </div>
                        <div>
                            <label className="text-sm">Contact</label>
                            <input
                                className="h-8 w-full bg-yellow-300 rounded-lg px-3 py-2"
                                type="text"
                                name="description"
                                placeholder="Enter menu description"
                                value={input.description}
                                onChange={changeEventHandler}
                            />
                        </div>
                        <div>
                            <label className="text-sm">Price in rupees</label>
                            <input
                                className="h-8 w-full bg-yellow-300 rounded-lg px-3 py-2"
                                type="text"
                                name="price"
                                placeholder="Enter menu price"
                                value={input.price}
                                onChange={changeEventHandler}
                            />
                        </div>
                        <div>
                            <label>Upload Menu image</label>
                            <input
                                className="w-full h-10 boh-12der border-black rounded-lg p-1 pl-4"
                                type="file"
                                accept="image/*"
                                name="imageFile"
                                onChange={(e) =>
                                    setInput({
                                        ...input,
                                        imageFile:
                                            e.target.files?.[0] || undefined,
                                    })
                                }
                            />
                            {/* {errors.imageFile && (
                                <FormHelperText className="text-red-500 text-sm">
                                    {errors.imageFile?.name || "image file is required"}
                                </FormHelperText>
                            )} */}
                        </div>
                        <Button
                            variant="contained"
                            className=" h-10 w-full col-span-2 pt-5"
                        >
                            {isLoading ? (
                                <>
                                    Please wait
                                    <LoaderCircle />
                                </>
                            ) : (
                                <>submit</>
                            )}
                        </Button>
                    </form>
                </Box>
            </Modal>
        </div>
    );
}
