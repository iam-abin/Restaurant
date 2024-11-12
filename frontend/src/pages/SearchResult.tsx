import { useParams } from "react-router-dom";
import Filter from "../components/Filter";
import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { Button, Chip } from "@mui/material";
import RestaurantCard from "../components/cards/RestaurantCard";
import RestaurantCardSkeleton from "../components/shimmer/RestaurantCardSkeleton";
import { NoResultFound } from "../components/NoResultFound";

const SearchResult = () => {
    const params = useParams();
    const [searchQuery, setSearchQuery] = useState<string>("");
    console.log(params.searchKey);

    const handleDelete = () => {};
    const searchResults = [];

    return (
        <div className=" max-w-7xl mx-auto my-5">
            <div className="flex flex-col md:flex-row justify-between gap-10">
                <Filter />
                <div className="flex-1">
                    {/* Search Input Field  */}
                    <div className="relative flex items-center gap-1">
                        <div className="w-full">
                            <SearchIcon className="absolute text-gray-500 inset-y-3 left-2" />
                            <input
                                type="text"
                                value={searchQuery}
                                placeholder="Search by restaurant, & cuisines"
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="border-2 pl-10 h-11 w-full  border-black shadow-lg rounded-lg"
                            />
                        </div>
                        <Button
                            // onClick={}
                            variant="contained"
                            className="bg-orange-500 "
                        >
                            Search
                        </Button>
                    </div>
                    {/* Searched Items display here  */}
                    <div>
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-2 my-3">
                            <h1 className="font-medium text-lg">
                                (3) Search result found
                                <div className="flex flex-wrap gap-2 mb-4 md:mb-0">
                                    {[
                                        "biriyani",
                                        "shawarma",
                                        "Kuzhi mandhi",
                                    ].map((selectedFlter, index) => (
                                        <div
                                            key={index}
                                            className="relative inline-flex items-center max-w-full"
                                        >
                                            <Chip
                                                label={selectedFlter}
                                                variant="outlined"
                                                onDelete={handleDelete}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </h1>
                        </div>
                    </div>
                    {/* Restaurant Cards  */}

                    {searchResults.length ? (
                        <div className="grid md:grid-cols-3 gap-4">
                            <RestaurantCard />
                            <RestaurantCardSkeleton />
                            <RestaurantCard />
                            <RestaurantCardSkeleton />
                            <RestaurantCard />
                            <RestaurantCardSkeleton />
                            <RestaurantCard />
                        </div>
                    ) : (
                        <NoResultFound searchText="hi" />
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchResult;
