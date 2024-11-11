import { ChangeEvent, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { Button } from "@mui/material";
import PizzaImage from "../assets/hero_pizza.png";
import { useNavigate } from "react-router-dom";

const Landing = () => {
    const [searchText, setSearchText] = useState<string>("");
    const navigate = useNavigate();
    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
    };
    return (
        <div className="flex flex-col md:flex-row max-w-7xl mx-auto md:p-10 rounded-lg items-center justify-center m-4 gap-20">
            <div className="flex flex-col gap-10 md:w-[41%]">
                <div className="flex flex-col gap-5 ">
                    <h1 className="font-bold md:font-extrabold text-4xl md:text-5xl">
                        Order Food anytime & anywhere
                    </h1>
                    <p className="text-gray-500">
                        Hey! Our Delicios food is waiting for you, we are always
                        near to you{" "}
                    </p>
                </div>
                <div className="relative flex gap-1">
                    <div className="w-full">
                        <SearchIcon className="absolute text-gray-500 inset-y-3 left-2" />
                        <input
                            type="text"
                            value={searchText}
                            placeholder="Search restaurant by name, city & country"
                            onChange={handleSearch}
                            className="border-2 pl-10 h-11 w-full  border-black shadow-lg rounded-lg"
                        />
                    </div>
                    <Button
                        onClick={() => navigate(`/search/:${searchText}`)}
                        variant="contained"
                        className="bg-orange-500 "
                    >
                        Search
                    </Button>
                </div>
            </div>
            <div>
                <img
                    src={PizzaImage}
                    className="w-full max-h-[500px] max-w-90%"
                    alt="LandingImg"
                />
            </div>
        </div>
    );
};

export default Landing;
