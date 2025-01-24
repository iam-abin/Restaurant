import { ChangeEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from '@mui/icons-material';

import PizzaImage from '../../assets/landing/hero_pizza.png';
import CustomButton from '../../components/Button/CustomButton';

const Landing: React.FC = () => {
    const [searchText, setSearchText] = useState<string>('');
    const navigate = useNavigate();

    const handleSearchClick = (): void => {
        if (!searchText) return;

        navigate(`/search/${searchText}`);
    };

    return (
        <div className="flex flex-col md:flex-row items-center justify-center  max-w-7xl md:p-10 rounded-lg  m-4 gap-20">
            {/* Left side */}
            <div className="flex flex-col gap-10 md:w-[41%]">
                <div className="flex flex-col gap-5 ">
                    <h1 className="font-bold md:font-extrabold text-4xl md:text-5xl">
                        Order Food anytime & anywhere
                    </h1>
                    <p className="text-gray-500">
                        Hey! Our Delicious food is waiting for you, we are always near to you{' '}
                    </p>
                </div>
                {/* search area */}
                <div className="relative flex gap-1">
                    <div className="w-full">
                        <Search className="absolute text-gray-500 inset-y-3 left-2" />
                        <input
                            type="text"
                            value={searchText}
                            placeholder="Search restaurant by name, city & country"
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchText(e.target.value)}
                            className="border-2 pl-10 h-11 w-full text-xs md:text-base border-black shadow-lg rounded-lg"
                        />
                    </div>
                    <CustomButton onClick={handleSearchClick}>Search</CustomButton>
                </div>
            </div>
            {/* Right side */}
            <div className="md:w-[41%]">
                <div className="w-full">
                    <img src={PizzaImage} className=" w-full max-h-[500px] max-w-90%" alt="LandingImg" />
                </div>
            </div>
        </div>
    );
};

export default Landing;
