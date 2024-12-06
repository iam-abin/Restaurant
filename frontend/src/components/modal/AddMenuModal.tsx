import React, { ChangeEvent, FormEvent, useState } from 'react';
import { Box, Modal, IconButton, Typography, TextField, Button, Grid } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LoaderCircle from '../Loader/LoaderCircle';
import { MenuFormSchema, menuSchema } from '../../utils/schema/menuSchema';
import { IResponse } from '../../types/api';
import { addMenuApi } from '../../api/apiMethods/menu';
import { hotToastMessage } from '../../utils/hotToast';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchMenus } from '../../redux/thunk/menusThunk';

const style = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: 600,
    bgcolor: 'background.paper',
    borderRadius: 4,
    boxShadow: 24,
    p: 4,
};

export default function AddMenuModal({ isOpen, handleClose }: { isOpen: boolean; handleClose: () => void }) {
    const [isLoading, setIsLoading] = useState(false);
    const [input, setInput] = useState<MenuFormSchema>({
        name: '',
        description: '',
        price: 0,
        image: undefined,
    });
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [errors, setErrors] = useState<Partial<MenuFormSchema>>({});
    const restaurantData = useAppSelector((state) => state.restaurantReducer.restaurantData);
    const dispatch = useAppDispatch();

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setInput((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setInput((prev) => ({ ...prev, image: file }));
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setPreviewImage(reader.result as string);
            reader.readAsDataURL(file);
        } else {
            setPreviewImage(null);
        }
    };

    const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});
        const inputData = { ...input, price: Number(input.price) || undefined };

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
            formData.append('price', inputData.price?.toString() ?? '0');
            if (inputData.image) formData.append('image', inputData.image);

            const restaurantId = restaurantData?._id;
            if (!restaurantId) {
                hotToastMessage('Restaurant ID is missing', 'error');
                setIsLoading(false);
                return;
            }

            const response: IResponse = await addMenuApi(formData);
            hotToastMessage(response.message, 'success');
            dispatch(fetchMenus({ restaurantId }));
            setInput({ name: '', description: '', price: 0, image: undefined });
            setPreviewImage(null);
            handleClose();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal open={isOpen} onClose={handleClose}>
            <Box sx={style}>
                <IconButton sx={{ position: 'absolute', top: 8, right: 8 }} onClick={handleClose}>
                    <CloseIcon />
                </IconButton>
                <Typography variant="h5" align="center" gutterBottom>
                    Add New Menu
                </Typography>
                <form onSubmit={submitHandler}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Name"
                                name="name"
                                value={input.name}
                                onChange={handleInputChange}
                                error={!!errors.name}
                                helperText={errors.name}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                name="description"
                                value={input.description}
                                onChange={handleInputChange}
                                error={!!errors.description}
                                helperText={errors.description}
                                variant="outlined"
                                multiline
                                rows={3}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Price (in ₹)"
                                name="price"
                                value={input.price}
                                onChange={handleInputChange}
                                error={!!errors.price}
                                helperText={errors.price}
                                variant="outlined"
                                type="number"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="contained" component="label" fullWidth>
                                Upload Image
                                <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                            </Button>
                            {previewImage && (
                                <Box mt={2} textAlign="center">
                                    <img
                                        src={previewImage}
                                        alt="Preview"
                                        style={{
                                            width: '100%',
                                            maxHeight: 200,
                                            objectFit: 'cover',
                                            borderRadius: 8,
                                        }}
                                    />
                                </Box>
                            )}
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                disabled={isLoading}
                            >
                                {isLoading ? <LoaderCircle /> : 'Submit'}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </Modal>
    );
}
