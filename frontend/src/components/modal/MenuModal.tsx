import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import {
    Box,
    Modal,
    IconButton,
    Typography,
    TextField,
    Grid,
    FormControlLabel,
    Checkbox,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LoaderCircle from '../Loader/LoaderCircle';
import { MenuFormSchema, menuSchema, hotToastMessage } from '../../utils';
import { IResponse } from '../../types/api';
import { addMenuApi } from '../../api/apiMethods/menu';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { searchCuisineApi } from '../../api/apiMethods/cuisine';
import { ICuisineResponse1, IMenu } from '../../types';
import AsyncCreatableSelect from 'react-select/async-creatable';
import { updateMenu } from '../../redux/thunk/menusThunk';
import CustomButton from '../Button/CustomButton';

const style = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: 600,
    maxHeight: '95vh',
    bgcolor: 'background.paper',
    borderRadius: 4,
    boxShadow: 24,
    p: 4,
    overflowY: 'auto',
};
export interface OptionType {
    value: string;
    label: string;
}

export interface IMenuModalProps {
    isOpen: boolean;
    handleClose: () => void;
    handleMenusDispatch?: (restaurantId: string) => void;
    initialValues?: IMenu;
    isEditMode?: boolean;
}

const MenuModal: React.FC<IMenuModalProps> = ({
    isOpen,
    handleClose,
    handleMenusDispatch,
    initialValues,
    isEditMode,
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [input, setInput] = useState<MenuFormSchema>({
        name: '',
        description: '',
        cuisine: '',
        price: 0,
        salePrice: undefined,
        featured: false,
        image: undefined,
    });

    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [errors, setErrors] = useState<Partial<MenuFormSchema>>({});
    const dispatch = useAppDispatch();
    const restaurantData = useAppSelector((state) => state.restaurantReducer.restaurantData);

    const transformInitialValueCuisine = (initialValues: IMenu) => {
        return { ...initialValues, cuisine: (initialValues.cuisineId as ICuisineResponse1).name };
    };

    // Populate fields with initial values in edit mode
    useEffect(() => {
        if (isEditMode && initialValues) {
            setInput(transformInitialValueCuisine(initialValues));
            setPreviewImage(initialValues.imageUrl ? initialValues.imageUrl : null);
        }
    }, [isEditMode, initialValues]);

    const resetForm = (): void => {
        setInput({
            name: '',
            description: '',
            cuisine: '',
            price: 0,
            salePrice: undefined,
            featured: false,
            image: undefined,
        });
        setPreviewImage(null);
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setInput((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const file: File | undefined = e.target.files?.[0];
        setInput((prev) => ({ ...prev, image: file }));
        if (file) {
            const reader: FileReader = new FileReader();
            reader.onload = () => setPreviewImage(reader.result as string);
            reader.readAsDataURL(file);
        } else {
            setPreviewImage(null);
        }
    };

    const submitHandler = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});
        const inputData = {
            ...input,
            price: Number(input.price) || undefined,
            salePrice: input.salePrice ? Number(input.salePrice) : undefined,
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
            formData.append('cuisine', inputData.cuisine);
            formData.append('price', inputData.price?.toString() ?? '0');
            formData.append('salePrice', inputData.salePrice ? inputData.salePrice?.toString() : '0');
            formData.append('featured', inputData.featured.toString());
            if (inputData.image) formData.append('image', inputData.image);

            const restaurantId = restaurantData?.restaurant._id;

            if (!restaurantId) {
                hotToastMessage('Restaurant ID is missing', 'error');
                setIsLoading(false);
                return;
            }

            if (isEditMode && initialValues) {
                // Call the API to update the menu
                const result = await dispatch(
                    updateMenu({ menuId: initialValues._id, updateData: formData as Partial<IMenu> }),
                );
                if (result.meta.requestStatus === 'rejected') {
                    hotToastMessage(result.payload as string, 'error');
                    return;
                }
            } else {
                // Call the API to add a new menu
                const response: IResponse = await addMenuApi(formData as unknown as IMenu);
                hotToastMessage(response.message, 'success');
                resetForm();
            }
            if (handleMenusDispatch) {
                handleMenusDispatch(restaurantId);
            }

            setPreviewImage(null);
            handleClose();
        } catch (error: unknown) {
            hotToastMessage((error as Error).message, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const [cuisineOptions, setCuisineOptions] = useState<OptionType[]>([]);

    useEffect(() => {
        (async () => {
            // To show in the dropdown area of cuisine
            await fetchCuisineSearchResult();
        })();
    }, []);

    const fetchCuisineSearchResult = async (searchtext?: string): Promise<void> => {
        const result: IResponse = await searchCuisineApi(searchtext);
        const mappedCuisineOptions: OptionType[] = mapCusineOptions(result.data as ICuisineResponse1[]);
        setCuisineOptions(mappedCuisineOptions);
    };

    const mapCusineOptions = (cuisines: ICuisineResponse1[]): OptionType[] => {
        return cuisines.map((cuisine: ICuisineResponse1) => ({ value: cuisine.name, label: cuisine.name }));
    };

    const handleSelectInputChange = (newValue: OptionType | null): void => {
        setInput((prev) => ({ ...prev, cuisine: newValue ? newValue.value : '' }));
        // Do something with the selected/created value
    };

    const promiseOptions = (inputValue: string): Promise<OptionType[]> =>
        new Promise<OptionType[]>((resolve) => {
            fetchCuisineSearchResult(inputValue).then(() => {
                //   setTimeout(() => {
                resolve(cuisineOptions);
                //   }, 1000);
            });
        });

    return (
        <Modal open={isOpen} onClose={handleClose}>
            <Box sx={style}>
                <IconButton sx={{ position: 'absolute', top: 8, right: 8 }} onClick={handleClose}>
                    <CloseIcon />
                </IconButton>
                <Typography variant="h5" align="center" gutterBottom>
                    {isEditMode ? 'Edit Menu' : 'Add New Menu'}
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
                            <TextField
                                fullWidth
                                label="Sale Price (in ₹)"
                                name="salePrice"
                                value={input.salePrice}
                                onChange={handleInputChange}
                                error={!!errors.salePrice}
                                helperText={errors.salePrice}
                                variant="outlined"
                                type="number"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={input.featured}
                                        onChange={
                                            (e) =>
                                                setInput((prev) => ({ ...prev, featured: e.target.checked })) // Change `isFeatured` to `featured`
                                        }
                                        name="featured"
                                        color="primary"
                                    />
                                }
                                label="Featured (e.g., special items, chef's recommendations etc)"
                            />
                        </Grid>
                        {/* select options add here */}
                        <Grid item xs={12}>
                            <AsyncCreatableSelect
                                cacheOptions
                                placeholder={'Select cuisine...'}
                                options={cuisineOptions}
                                defaultOptions={cuisineOptions}
                                loadOptions={promiseOptions}
                                onChange={handleSelectInputChange}
                                defaultValue={
                                    input?.cuisine ? { value: input.cuisine, label: input.cuisine } : null
                                }
                            />
                            {errors.cuisine && <span className="text-red-500 text-sm">{errors.cuisine}</span>}
                        </Grid>
                        <Grid item xs={12}>
                            <CustomButton
                                variant="contained"
                                className="w-full"
                                sx={{ background: '#059dc0' }}
                                onClick={() => document.getElementById('fileInput')?.click()}
                            >
                                Upload Image
                                <input
                                    type="file"
                                    className="bg-red"
                                    id="fileInput"
                                    hidden
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </CustomButton>
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
                            <CustomButton className="w-full" type="submit" disabled={isLoading}>
                                {' '}
                                {isLoading ? <LoaderCircle /> : isEditMode ? 'Update' : 'Submit'}
                            </CustomButton>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </Modal>
    );
};

export default MenuModal;
