import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import { Alert, Avatar, Box, Tooltip, Typography } from '@mui/material';
import { Add, Email, Flag, LocationOn, LocationSearching, Phone } from '@mui/icons-material';

import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchUserProfile, updateUserProfile } from '../../redux/thunk/profileThunk';
import { IAddress, IUser } from '../../types';
import LoaderCircle from '../../components/Loader/LoaderCircle';
import { useConfirmationContext } from '../../context/confirmationContext';
import CustomButton from '../../components/Button/CustomButton';
import { checkFileType, hotToastMessage, ProfileFormSchema, profileFromSchema } from '../../utils';

const Profile: React.FC = () => {
    const [selectedProfilePicture, setSelectedProfilePicture] = useState<string>('');
    const [errors, setErrors] = useState<Partial<ProfileFormSchema>>({});

    const dispatch = useAppDispatch();
    const { showConfirmation } = useConfirmationContext();

    const { authData } = useAppSelector((state) => state.authReducer);
    const { myProfile, status } = useAppSelector((state) => state.profileReducer);

    const fetchUserProfileData = async () => {
        const response = await dispatch(fetchUserProfile());
        if (response.meta.requestStatus === 'rejected') {
            hotToastMessage(response.payload as string, 'error');
        }
    };

    useEffect(() => {
        fetchUserProfileData();
    }, []);

    const isLoading: boolean = status === 'loading';
    const imageRef: React.MutableRefObject<HTMLInputElement | null> = useRef<HTMLInputElement | null>(null);
    const [profileData, setProfileData] = useState<ProfileFormSchema>({
        name: (myProfile?.userId as IUser)?.name || '',
        phone: (myProfile?.userId as IUser)?.phone || '',
        address: (myProfile?.addressId as IAddress)?.address || '',
        city: (myProfile?.addressId as IAddress)?.city || '',
        country: (myProfile?.addressId as IAddress)?.country || '',
        image: myProfile?.imageUrl || '',
    });

    const fileChangeHandler = (e: ChangeEvent<HTMLInputElement>): void => {
        const file: File | undefined = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        const requiredFileType: string = 'image';
        const isValid: boolean = checkFileType(file, requiredFileType);
        if (!isValid) {
            hotToastMessage(`Please select a valid ${requiredFileType} file.`, 'error');
            return;
        }

        const reader: FileReader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result as string;
            setSelectedProfilePicture(result);
            setProfileData((prevData) => ({
                ...prevData,
                image: result,
            }));
        };
        reader.readAsDataURL(file);
    };

    const changeHandler = (e: ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setProfileData({ ...profileData, [name]: value });
    };

    const handleUpdateProfileButton = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        showConfirmation({
            title: 'Do you want to update profile',
            description: 'Are you sure?',
            onAgree: () => updateProfileHandler(),
            closeText: 'No',
            okayText: 'Yes',
        });
    };

    const updateProfileHandler = async (): Promise<void> => {
        setErrors({});

        const updateData = {
            ...profileData,
            phone: profileData.phone.toString(),
        };
        const result = profileFromSchema.safeParse(updateData);

        if (!result.success) {
            const fieldErrors = result.error.formErrors.fieldErrors;
            setErrors(fieldErrors as Partial<ProfileFormSchema>);
            return;
        }

        const response = await dispatch(updateUserProfile({ ...profileData, image: selectedProfilePicture }));
        if (response.meta.requestStatus === 'rejected') {
            hotToastMessage(response.payload as string, 'error');
            return;
        }

        setSelectedProfilePicture('');
    };

    const isProfileIncomplete: boolean =
        !profileData.name ||
        !profileData.city ||
        !profileData.address ||
        !profileData.country ||
        !profileData.phone;

    return (
        <form onSubmit={handleUpdateProfileButton} className=" mx-auto my-5">
            {/* Warning message */}
            {isProfileIncomplete && (
                <Alert severity="warning" className="mb-4">
                    Fill all the profile details before making orders.
                </Alert>
            )}
            <div className="flex items-center justify-between">
                <div className="flex gap-2 items-center">
                    {/* Profile image */}
                    <div className="flex flex-col items-center gap-2 relative">
                        <Avatar
                            sx={{
                                width: 80,
                                height: 80,
                                md: { width: 112, height: 112 },
                            }}
                            src={profileData.image || '/broken-image.jpg'}
                        />
                        {/* Overlay for hover effect */}
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                borderRadius: '50%',
                                opacity: 0,
                                transition: 'opacity 0.3s',
                                '&:hover': {
                                    opacity: 1,
                                },
                            }}
                        >
                            <input
                                type="file"
                                ref={imageRef}
                                accept="image/*"
                                onChange={fileChangeHandler}
                                className="hidden bg-inherit"
                            />

                            <Add
                                className="hover:cursor-pointer text-white w-10 h-10"
                                onClick={() => imageRef.current?.click()}
                            />
                        </Box>
                        {errors && <Typography className="text-sm text-red-500">{errors.image}</Typography>}
                    </div>
                    {/* Name */}
                    <div>
                        <input
                            type="text"
                            placeholder="update your name"
                            name="name"
                            value={profileData.name}
                            onChange={changeHandler}
                            className="h-8 font-bold outline-none border-none"
                        />
                        {errors && <Typography className="text-sm text-red-500">{errors.name}</Typography>}
                    </div>
                </div>
            </div>
            {/* Email */}
            <Tooltip title="Cannot modify email field">
                <div className="flex items-center gap-4 rounded-sm p-2 bg-gray-200">
                    <Email className="text-gray-500" />
                    <div className="w-full">
                        <label>Email</label>
                        <span className="w-full block text-gray-600 bg-transparent focus-visible:ring-0 focus-visible:border-transparent outline-none border-none">
                            {authData && authData.email}
                        </span>
                    </div>
                </div>
            </Tooltip>

            <div className="grid md:grid-cols-4 md:gap-2 gap-3 my-10">
                {/* Phone */}
                <div>
                    <div className="flex items-center gap-4 rounded-sm p-2 bg-gray-200">
                        <Phone className="text-gray-500" />
                        <div className="w-full">
                            <label>
                                Phone
                                <Tooltip title="Clilck to modify 'Phone'">
                                    <input
                                        name="phone"
                                        placeholder="update your phone"
                                        value={profileData.phone}
                                        onChange={changeHandler}
                                        className="w-full text-gray-600 bg-transparent focus-visible:ring-0 focus-visible:border-transparent outline-none border-none"
                                    />
                                </Tooltip>
                            </label>
                        </div>
                    </div>
                    {errors && <Typography className="text-sm text-red-500">{errors.phone}</Typography>}
                </div>
                {/* Address */}
                <div>
                    <div className="flex items-center gap-4 rounded-sm p-2 bg-gray-200">
                        <LocationOn className="text-gray-500" />
                        <div className="w-full">
                            <label>
                                Address{' '}
                                <Tooltip title="Clilck to modify the 'Address'">
                                    <input
                                        name="address"
                                        id="address"
                                        placeholder="update your address"
                                        value={profileData.address}
                                        onChange={changeHandler}
                                        className="w-full text-gray-600 bg-transparent focus-visible:ring-0 focus-visible:border-transparent outline-none border-none"
                                    />
                                </Tooltip>
                            </label>
                        </div>
                    </div>
                    {errors && <Typography className="text-sm text-red-500">{errors.address}</Typography>}
                </div>
                {/* City */}
                <div>
                    <div className="flex items-center gap-4 rounded-sm p-2 bg-gray-200">
                        <LocationSearching className="text-gray-500" />
                        <div className="w-full">
                            <label>
                                City
                                <Tooltip title="Clilck to modify the 'city'">
                                    <input
                                        name="city"
                                        placeholder="update your city"
                                        value={profileData.city}
                                        onChange={changeHandler}
                                        className="w-full text-gray-600 bg-transparent focus-visible:ring-0 focus-visible:border-transparent outline-none border-none"
                                    />
                                </Tooltip>
                            </label>
                        </div>
                    </div>
                    {errors && <Typography className="text-sm text-red-500">{errors.city}</Typography>}
                </div>
                {/* Country */}
                <div>
                    <div className="flex items-center gap-4 rounded-sm p-2 bg-gray-200">
                        <Flag className="text-gray-500" />
                        <div className="w-full">
                            <label>
                                Country
                                <Tooltip title="Clilck to modify the 'country'">
                                    <input
                                        name="country"
                                        placeholder="update your country"
                                        value={profileData.country}
                                        onChange={changeHandler}
                                        className="w-full text-gray-600 bg-transparent focus-visible:ring-0 focus-visible:border-transparent outline-none border-none"
                                    />
                                </Tooltip>
                            </label>
                        </div>
                    </div>
                    {errors && <Typography className="text-sm text-red-500">{errors.country}</Typography>}
                </div>
            </div>

            <div className="text-center">
                <CustomButton type="submit" disabled={isLoading} className="w-2/6">
                    {isLoading ? (
                        <label className="flex items-center gap-4">
                            updating... <LoaderCircle />
                        </label>
                    ) : (
                        'Update'
                    )}
                </CustomButton>
            </div>
        </form>
    );
};

export default Profile;
