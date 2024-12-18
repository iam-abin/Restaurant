import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import { Avatar, Box, Button, Tooltip } from '@mui/material';
import { Add, Email, Flag, LocationOn, LocationSearching } from '@mui/icons-material';

import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchUserProfile, updateUserProfile } from '../../redux/thunk/profileThunk';
import { IAddress } from '../../types';
import LoaderCircle from '../../components/Loader/LoaderCircle';

const Profile = () => {
    const [selectedProfilePicture, setSelectedProfilePicture] = useState<string>('');
    const dispatch = useAppDispatch();

    const { authData } = useAppSelector((state) => state.authReducer);
    const { myProfile, status } = useAppSelector((state) => state.profileReducer);
    console.log('authData ', authData);
    console.log('myProfile ', myProfile);

    useEffect(() => {
        dispatch(fetchUserProfile());
    }, []);
    const isLoading: boolean = status === 'loading';
    const imageRef = useRef<HTMLInputElement | null>(null);
    const [profileData, setProfileData] = useState({
        name: authData?.name || '',
        address: (myProfile?.addressId as IAddress)?.address || '',
        city: (myProfile?.addressId as IAddress)?.city || '',
        country: (myProfile?.addressId as IAddress)?.country || '',
        image: myProfile?.imageUrl || '',
    });
    const fileChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) {
            return;
        }

        const reader = new FileReader();
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

    const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfileData({ ...profileData, [name]: value });
    };

    const updateProfileHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log({ ...profileData, image: selectedProfilePicture });
        dispatch(updateUserProfile({ ...profileData, image: selectedProfilePicture }));
        setSelectedProfilePicture('');
    };

    return (
        <form onSubmit={updateProfileHandler} className=" mx-auto my-5">
            <div className="flex items-center justify-between">
                <div className="flex gap-2 items-center">
                    <div className="flex items-center gap-2 relative">
                        <Avatar
                            sx={{
                                width: 80,
                                height: 80,
                                md: { width: 112, height: 112 },
                            }}
                            src={profileData.image || `/broken-image.jpg`}
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
                    </div>
                    <input
                        type="text"
                        placeholder="update your name"
                        name="name"
                        value={profileData.name}
                        onChange={changeHandler}
                        className="h-8 font-bold outline-none border-none"
                    />
                </div>
            </div>
            <div className="grid md:grid-cols-4 md:gap-2 gap-3 my-10">
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
                <div className="flex items-center gap-4 rounded-sm p-2 bg-gray-200">
                    <LocationOn className="text-gray-500" />
                    <div className="w-full">
                        <label>
                            Address{' '}
                            <input
                                name="address"
                                id="address"
                                placeholder="update your address"
                                value={profileData.address}
                                onChange={changeHandler}
                                className="w-full text-gray-600 bg-transparent focus-visible:ring-0 focus-visible:border-transparent outline-none border-none"
                            />
                        </label>
                    </div>
                </div>
                <div className="flex items-center gap-4 rounded-sm p-2 bg-gray-200">
                    <LocationSearching className="text-gray-500" />
                    <div className="w-full">
                        <label>
                            City
                            <input
                                name="city"
                                placeholder="update your city"
                                value={profileData.city}
                                onChange={changeHandler}
                                className="w-full text-gray-600 bg-transparent focus-visible:ring-0 focus-visible:border-transparent outline-none border-none"
                            />
                        </label>
                    </div>
                </div>
                <div className="flex items-center gap-4 rounded-sm p-2 bg-gray-200">
                    <Flag className="text-gray-500" />
                    <div className="w-full">
                        <label>
                            Country
                            <input
                                name="country"
                                placeholder="update your country"
                                value={profileData.country}
                                onChange={changeHandler}
                                className="w-full text-gray-600 bg-transparent focus-visible:ring-0 focus-visible:border-transparent outline-none border-none"
                            />
                        </label>
                    </div>
                </div>
            </div>

            <div className="text-center">
                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-2/6 mb-5 bg-orange-300"
                    variant="contained"
                >
                    {isLoading ? (
                        <label className="flex items-center gap-4">
                            Please wait <LoaderCircle />
                        </label>
                    ) : (
                        'Update'
                    )}
                </Button>
            </div>
        </form>
    );
};

export default Profile;
