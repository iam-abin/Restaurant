import { Avatar, Box, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import LoaderCircle from '../../components/Loader/LoaderCircle';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import FlagIcon from '@mui/icons-material/Flag';
import LocationSearchingIcon from '@mui/icons-material/LocationSearching';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchUserProfile, updateUserProfile } from '../../redux/thunk/profileThunk';
import { IAddress } from '../../types';

const Profile = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedProfilePicture, setSelectedProfilePicture] = useState<string>('');
    const dispatch = useAppDispatch();

    const { authData } = useAppSelector((state) => state.authReducer);
    const { myProfile } = useAppSelector((state) => state.profileReducer);
    console.log('authData ', authData);
    console.log('myProfile ', myProfile);

    useEffect(() => {
        dispatch(fetchUserProfile());
    }, []);

    const imageRef = useRef<HTMLInputElement | null>(null);
    const [profileData, setProfileData] = useState({
        name: authData?.name || '',
        address: (myProfile?.addressId as IAddress)?.address || '',
        city: (myProfile?.addressId as IAddress)?.city || '',
        country: (myProfile?.addressId as IAddress)?.country || '',
        image: myProfile?.imageUrl || ''
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
                image: result
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
        setIsLoading(true);
        console.log({ ...profileData, image: selectedProfilePicture });
        dispatch(updateUserProfile({ ...profileData, image: selectedProfilePicture }));
        setIsLoading(false);
        setSelectedProfilePicture('');
    };

    return (
        <form onSubmit={updateProfileHandler} className=" max-w-7xl mx-auto my-5">
            <div className="flex items-center justify-between">
                <div className="flex gap-2 items-center">
                    <div className="flex items-center gap-2 relative">
                        <Avatar
                            sx={{
                                width: 80,
                                height: 80,
                                md: { width: 112, height: 112 }
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
                                    opacity: 1
                                }
                            }}
                        >
                            <input
                                type="file"
                                ref={imageRef}
                                accept="image/*"
                                onChange={fileChangeHandler}
                                className="hidden"
                            />
                            <AddIcon
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
                <div className="flex items-center gap-4 rounded-sm p-2 bg-gray-200">
                    <EmailIcon className="text-gray-500" />
                    <div className="w-full">
                        <label>Email</label>
                        <span className="w-full block text-gray-600 bg-transparent focus-visible:ring-0 focus-visible:border-transparent outline-none border-none">
                            {authData && authData.email}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-4 rounded-sm p-2 bg-gray-200">
                    <LocationOnIcon className="text-gray-500" />
                    <div className="w-full">
                        <label>Address</label>
                        <input
                            name="address"
                            placeholder="update your address"
                            value={profileData.address}
                            onChange={changeHandler}
                            className="w-full text-gray-600 bg-transparent focus-visible:ring-0 focus-visible:border-transparent outline-none border-none"
                        />
                    </div>
                </div>
                <div className="flex items-center gap-4 rounded-sm p-2 bg-gray-200">
                    <LocationSearchingIcon className="text-gray-500" />
                    <div className="w-full">
                        <label>City</label>
                        <input
                            name="city"
                            placeholder="update your city"
                            value={profileData.city}
                            onChange={changeHandler}
                            className="w-full text-gray-600 bg-transparent focus-visible:ring-0 focus-visible:border-transparent outline-none border-none"
                        />
                    </div>
                </div>
                <div className="flex items-center gap-4 rounded-sm p-2 bg-gray-200">
                    <FlagIcon className="text-gray-500" />
                    <div className="w-full">
                        <label>Country</label>
                        <input
                            name="country"
                            placeholder="update your country"
                            value={profileData.country}
                            onChange={changeHandler}
                            className="w-full text-gray-600 bg-transparent focus-visible:ring-0 focus-visible:border-transparent outline-none border-none"
                        />
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
