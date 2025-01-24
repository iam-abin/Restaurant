import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Chip, Drawer, IconButton, Box } from '@mui/material';
import { Search, FilterList } from '@mui/icons-material';

import { getCuisinesApi, searchFilterRestaurantApi } from '../../api/apiMethods';
import { ICuisineResponse1, IResponse, ISearchResult, SearchResponse } from '../../types';
import { NoResultFound } from '../../components/cards/NoResultFound';
import LoaderCircle from '../../components/Loader/LoaderCircle';
import RestaurantCard from '../../components/cards/RestaurantCard';
import RestaurantCardSkeleton from '../../components/shimmer/RestaurantCardSkeleton';
import Filter from '../../components/filter/Filter';
import PaginationButtons from '../../components/pagination/PaginationButtons';
import usePagination from '../../hooks/usePagination';
import CustomButton from '../../components/Button/CustomButton';
import SearchBar from '../../components/search/SearchBar';
import { DEFAULT_LIMIT_VALUE } from '../../constants';

const SearchResult: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [filtersList, setFiltersList] = useState<ICuisineResponse1[]>([]);
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
    const [searchResults, setSearchResults] = useState<ISearchResult[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState<boolean>(false);
    const { currentPage, handlePageChange, totalNumberOfPages, setTotalNumberOfPages } = usePagination({});

    const params = useParams();
    const searchText: string = params.searchText || '';

    const fetchRestaurants = async (): Promise<void> => {
        setIsLoading(true);
        try {
            const response: IResponse = await searchFilterRestaurantApi({
                searchText,
                searchQuery,
                selectedCuisines: selectedFilters,
                page: currentPage,
                limit: DEFAULT_LIMIT_VALUE,
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
    }, [selectedFilters, searchQuery, searchText, currentPage]);

    useEffect(() => {
        fetchFilters();
    }, []);

    const handleDeleteChip = (filter: string): void => {
        setSelectedFilters((prev) => prev.filter((item) => item !== filter));
    };

    const handleSearchButton = (): void => {
        if (searchQuery === '') return;
        fetchRestaurants();
    };

    return (
        <div className="flex flex-col md:flex-row justify-between gap-1 my-5">
            {/* Left Filter Drawer Toggle icon */}
            <div className="block md:hidden">
                <IconButton onClick={() => setIsFilterDrawerOpen(true)}>
                    <FilterList />
                </IconButton>
            </div>
            {/* Filter Drawer */}
            <Drawer anchor="left" open={isFilterDrawerOpen} onClose={() => setIsFilterDrawerOpen(false)}>
                <Box className="p-3" role="presentation">
                    <Filter
                        filterArray={selectedFilters}
                        setSelectedFilters={setSelectedFilters}
                        filtersList={filtersList}
                    />
                </Box>
            </Drawer>

            {/* Left Filter Panel for Larger Screens */}
            <div className="hidden md:block shadow-2xl  p-3 rounded-lg">
                <Filter
                    filterArray={selectedFilters}
                    setSelectedFilters={setSelectedFilters}
                    filtersList={filtersList}
                />
            </div>

            {/* Right Side */}
            <div className="flex-col shadow-2xl px-7 py-3 rounded-lg w-full bg-gradient-to-br from-white to-gray-100 ">
                <div className="relative flex items-center gap-1">
                    <div className="w-full">
                        <Search className="absolute text-gray-500 inset-y-3 left-2" />
                        <SearchBar
                            className="border-2 pl-10 text-xs md:text-base h-11 w-full  border-black shadow-2xl rounded-lg"
                            placeholder={'search by restaurant& cuisines'}
                            onSearch={setSearchQuery}
                        />
                    </div>
                    <CustomButton onClick={handleSearchButton} variant="contained" disabled={isLoading}>
                        {isLoading ? <LoaderCircle /> : 'Search'}
                    </CustomButton>
                </div>

                {/* Cuisines chip */}
                <div className="flex gap-2 my-3">
                    {selectedFilters &&
                        selectedFilters.map((filter, index) => (
                            <Chip
                                key={index}
                                label={filter}
                                variant="outlined"
                                onDelete={() => handleDeleteChip(filter)}
                            />
                        ))}
                </div>

                {/* Restaurant list */}
                <div className="flex flex-wrap justify-center md:justify-start gap-3 md:gap-2">
                    {isLoading && searchResults.length === 0 ? (
                        Array.from(new Array(DEFAULT_LIMIT_VALUE)).map((_, index: number) => (
                            <RestaurantCardSkeleton key={index} />
                        ))
                    ) : searchResults.length ? (
                        searchResults.map((restaurant, index) => (
                            <RestaurantCard key={index} restaurant={restaurant} />
                        ))
                    ) : (
                        <NoResultFound
                            searchText={searchText}
                            searchQuery={searchQuery}
                            filterList={selectedFilters}
                        />
                    )}
                </div>

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
