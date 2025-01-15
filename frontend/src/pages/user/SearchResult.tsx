import { ChangeEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Chip } from '@mui/material';
import { Search } from '@mui/icons-material';

import { getCuisinesApi, searchFilterRestaurantApi } from '../../api/apiMethods';
import { ICuisineResponse1, IResponse, ISearchResult, SearchResponse } from '../../types';
import { NoResultFound } from '../../components/NoResultFound';
import LoaderCircle from '../../components/Loader/LoaderCircle';
import RestaurantCard from '../../components/cards/RestaurantCard';
import RestaurantCardSkeleton from '../../components/shimmer/RestaurantCardSkeleton';
import Filter from '../../components/Filter';
import PaginationButtons from '../../components/pagination/PaginationButtons';
import usePagination from '../../hooks/usePagination';
import CustomButton from '../../components/Button/CustomButton';

const SearchResult: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [filtersList, setFiltersList] = useState<ICuisineResponse1[]>([]);
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
    const [searchResults, setSearchResults] = useState<ISearchResult[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { currentPage, handlePageChange, totalNumberOfPages, setTotalNumberOfPages } = usePagination({});

    const params = useParams();
    const searchText: string = params.searchText || '';
    const fetchRestaurants = async (): Promise<void> => {
        setIsLoading(true);
        try {
            const response = await searchFilterRestaurantApi({
                searchText,
                searchQuery,
                selectedCuisines: selectedFilters,
                page: currentPage,
            });
            setSearchResults((response.data as SearchResponse).restaurants);
            setTotalNumberOfPages((response.data as SearchResponse).numberOfPages);
        } catch {
            setSearchResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchFilters = async (): Promise<void> => {
        const filtersLis: IResponse = await getCuisinesApi();
        setFiltersList(filtersLis.data as ICuisineResponse1[]);
    };

    useEffect(() => {
        fetchRestaurants();
    }, [selectedFilters, searchText]);

    useEffect(() => {
        fetchFilters();
    }, []);

    const handleDeleteChip = (filter: string): void => {
        setSelectedFilters((prev) => prev.filter((item) => item !== filter));
    };

    const handleSearch = (): void => {
        if (searchQuery === '') return;
        fetchRestaurants();
    };

    const handleSearchKeyChange = (e: ChangeEvent<HTMLInputElement>): void => {
        if (e.target.value === '') fetchRestaurants();
        setSearchQuery(e.target.value);
    };

    return (
        <div className="flex flex-col  md:flex-row justify-between gap-1  bg-violet-300 my-5">
            {/* left side */}
            <div className="bg-red-100  p-3 rounded-lg">
                <Filter
                    filterArray={selectedFilters}
                    setSelectedFilters={setSelectedFilters}
                    filtersList={filtersList}
                />
            </div>
            {/* right side */}
            <div className="flex-col bg-green-100 py-3 rounded-lg">
                <div className="relative flex items-center gap-1">
                    <div className="w-full">
                        <Search className="absolute text-gray-500 inset-y-3 left-2" />
                        <input
                            type="text"
                            value={searchQuery}
                            placeholder="Search by restaurant & cuisines"
                            onChange={(e) => handleSearchKeyChange(e)}
                            onKeyPress={(e) => e.key === 'Enter' && fetchRestaurants()}
                            className="border-2 pl-10 h-11 w-full border-black shadow-lg rounded-lg"
                        />
                    </div>
                    <CustomButton onClick={handleSearch} variant="contained" disabled={isLoading}>
                        {isLoading ? <LoaderCircle /> : 'Search'}
                    </CustomButton>
                </div>

                <div className="flex gap-2 my-3">
                    {selectedFilters.map((filter, index) => (
                        <Chip
                            key={index}
                            label={filter}
                            variant="outlined"
                            onDelete={() => handleDeleteChip(filter)}
                        />
                    ))}
                </div>

                {isLoading ? (
                    <div className="flex flex-wrap justify-center gap-3">
                        <RestaurantCardSkeleton />
                        <RestaurantCardSkeleton />
                    </div>
                ) : searchResults.length ? (
                    <div className="flex flex-wrap justify-center gap-3">
                        {searchResults.map((restaurant, index) => (
                            <RestaurantCard key={index} restaurant={restaurant} />
                        ))}
                        {searchResults.map((restaurant, index) => (
                            <RestaurantCard key={index} restaurant={restaurant} />
                        ))}

                        {searchResults.map((restaurant, index) => (
                            <RestaurantCard key={index} restaurant={restaurant} />
                        ))}
                    </div>
                ) : (
                    <NoResultFound
                        searchText={searchText}
                        searchQuery={searchQuery}
                        filterList={selectedFilters}
                    />
                )}
                <div className="flex justify-center my-10">
                    <PaginationButtons
                        handlePageChange={handlePageChange}
                        numberOfPages={totalNumberOfPages}
                        currentPage={currentPage}
                    />
                </div>
            </div>
        </div>
    );
};

export default SearchResult;
