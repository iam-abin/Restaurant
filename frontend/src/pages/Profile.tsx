import { Avatar, Box, Button } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { ChangeEvent, FormEvent, useRef, useState } from 'react'
import LoaderCircle from '../components/Loader/LoaderCircle'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import EmailIcon from '@mui/icons-material/Email'
import FlagIcon from '@mui/icons-material/Flag'
import LocationSearchingIcon from '@mui/icons-material/LocationSearching'

type ProfileDataState = {
    name: string
    email: string
    address: string
    city: string
    country: string
    image: string
}

const Profile = () => {
    const imageRef = useRef<HTMLInputElement | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [selectedProfilePicture, setSelectedProfilePicture] = useState<string>('')
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        address: '',
        city: '',
        country: '',
        image: ''
    })
    const fileChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) {
            return
        }

        const reader = new FileReader()
        reader.onloadend = () => {
            const result = reader.result as string
            setSelectedProfilePicture(result)
            setProfileData((prevData) => ({
                ...prevData,
                image: result
            }))
        }
        reader.readAsDataURL(file)
    }

    const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setProfileData({ ...profileData, [name]: value })
    }

    const updateProfileHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log(profileData)

        // try {
        //   setIsLoading(true);
        //   await updateProfile(profileData);
        //   setIsLoading(false);
        // } catch (error) {
        //   setIsLoading(false);
        // }
    }

    return (
        <form className=" max-w-7xl mx-auto my-5">
            <div className="flex items-center justify-between">
                <div className="flex gap-2 items-center">
                    <div className="flex items-center gap-2 relative">
                        <Avatar
                            sx={{
                                width: 80,
                                height: 80,
                                md: { width: 112, height: 112 }
                            }}
                            src="/broken-image.jpg"
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
                        name={profileData.name}
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
                        <input
                            name="email"
                            value={profileData.email}
                            onChange={changeHandler}
                            className="w-full text-gray-600 bg-transparent focus-visible:ring-0 focus-visible:border-transparent outline-none border-none"
                        />
                    </div>
                </div>
                <div className="flex items-center gap-4 rounded-sm p-2 bg-gray-200">
                    <LocationOnIcon className="text-gray-500" />
                    <div className="w-full">
                        <label>Address</label>
                        <input
                            name="address"
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
    )
}

export default Profile
