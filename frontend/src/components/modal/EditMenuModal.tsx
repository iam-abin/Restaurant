import { ChangeEvent, FormEvent, useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { Button, CircularProgress } from '@mui/material';
import { MenuFormSchema, menuSchema } from '../../utils/schema/menuSchema';
import { IMenu } from '../../types';
import { IResponse } from '../../types/api';
import { hotToastMessage } from '../../utils/hotToast';
import { editMenuApi } from '../../api/apiMethods/menu';
import { fetchMenus } from '../../redux/thunk/menusThunk';
import { useAppDispatch } from '../../redux/hooks';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: '600px',
    bgcolor: 'background.paper',
    borderRadius: '16px',
    boxShadow: 24,
    p: 4,
};

export default function EditMenuModal({
    menu,
    isOpen,
    handleClose,
}: {
    menu: IMenu;
    isOpen: boolean;
    handleClose: () => void;
}) {
    const [errors, setErrors] = useState<Partial<MenuFormSchema>>({});
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useAppDispatch();
    const [input, setInput] = useState<MenuFormSchema>({
        name: menu.name,
        description: menu.description,
        price: menu.price,
        image: undefined,
    });

    const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});
        const inputData = {
            ...input,
            price: input.price ? Number(input.price) : undefined,
        };

        const result = menuSchema.safeParse(inputData);
        if (!result.success) {
            setErrors(result.error.formErrors.fieldErrors as Partial<MenuFormSchema>);
            setIsLoading(false);
            return;
        }
        try {
            const formData = new FormData();
            formData.append('name', inputData.name);
            formData.append('description', inputData.description);
            formData.append('price', inputData.price!.toString());
            if (inputData.image) formData.append('image', inputData.image);

            const response: IResponse = await editMenuApi(menu._id.toString(), formData);
            hotToastMessage(response.message, 'success');
            dispatch(fetchMenus({ restaurantId: menu.restaurantId }));
            handleClose();
        } finally {
            setIsLoading(false);
        }
    };

    const changeEventHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setInput((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <Modal
            open={isOpen}
            onClose={handleClose}
            aria-labelledby="edit-menu-modal-title"
            aria-describedby="edit-menu-modal-description"
        >
            <Box sx={style}>
                <IconButton
                    sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                    }}
                    onClick={handleClose}
                >
                    <CloseIcon />
                </IconButton>
                <Typography
                    id="edit-menu-modal-title"
                    variant="h5"
                    component="h2"
                    textAlign="center"
                    fontWeight="bold"
                >
                    Edit Menu
                </Typography>
                <Typography
                    id="edit-menu-modal-description"
                    variant="body2"
                    color="textSecondary"
                    textAlign="center"
                    mt={1}
                >
                    Update your menu details to reflect the latest changes.
                </Typography>
                <form onSubmit={submitHandler} className="flex flex-col gap-4 mt-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Menu Name</label>
                        <input
                            className="h-10 w-full bg-gray-100 border border-gray-300 rounded-lg px-3"
                            type="text"
                            name="name"
                            value={input.name}
                            onChange={changeEventHandler}
                            placeholder="Enter menu name"
                        />
                        {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <input
                            className="h-10 w-full bg-gray-100 border border-gray-300 rounded-lg px-3"
                            type="text"
                            name="description"
                            value={input.description}
                            onChange={changeEventHandler}
                            placeholder="Enter menu description"
                        />
                        {errors.description && (
                            <p className="text-sm text-red-500 mt-1">{errors.description}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Price</label>
                        <input
                            className="h-10 w-full bg-gray-100 border border-gray-300 rounded-lg px-3"
                            type="text"
                            name="price"
                            value={input.price}
                            onChange={changeEventHandler}
                            placeholder="Enter menu price"
                        />
                        {errors.price && <p className="text-sm text-red-500 mt-1">{errors.price}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Upload Image</label>
                        <input
                            className="w-full h-10 border border-gray-300 rounded-lg p-2"
                            type="file"
                            accept="image/*"
                            name="image"
                            onChange={(e) =>
                                setInput((prev) => ({
                                    ...prev,
                                    image: e.target.files?.[0],
                                }))
                            }
                        />
                        {/* {errors.image && <p className="text-sm text-red-500 mt-1">{errors?.image}</p>} */}
                    </div>
                    <Button type="submit" variant="contained" color="primary" className="w-full h-12 mt-4">
                        {isLoading ? <CircularProgress size={20} color="inherit" /> : 'Update Menu'}
                    </Button>
                </form>
            </Box>
        </Modal>
    );
}
