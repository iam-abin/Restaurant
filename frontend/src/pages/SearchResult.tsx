import { useParams } from 'react-router-dom'
import Filter from '../components/Filter'
import { ChangeEvent, MouseEvent, useEffect, useState } from 'react'
import SearchIcon from '@mui/icons-material/Search'
import { Button, Chip } from '@mui/material'
import RestaurantCard from '../components/cards/RestaurantCard'
import RestaurantCardSkeleton from '../components/shimmer/RestaurantCardSkeleton'
import { NoResultFound } from '../components/NoResultFound'
import { searchRestaurantApi } from '../api/apiMethods/restaurant'
import LoaderCircle from '../components/Loader/LoaderCircle'

const SearchResult = () => {
    const [searchQuery, setSearchQuery] = useState<string>('')
    const [selectedFilters, setSelectedFilters] = useState<string[]>([])
    const [searchResults, setSearchResults] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const params = useParams()
    const searchText = params.searchText || ''

    const fetchRestaurants = async () => {
        setIsLoading(true)
        try {
            const response = await searchRestaurantApi({
                searchText,
                searchQuery,
                selectedCuisines: selectedFilters
            })
            setSearchResults(response.data || [])
        } catch (error) {
            console.error('Error fetching search results:', error)
            setSearchResults([])
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchRestaurants()
    }, [selectedFilters, searchText])

    const handleDeleteChip = (filter: string) => {
        setSelectedFilters((prev) => prev.filter((item) => item !== filter))
    }

    const handleSearch = () => {
        if (searchQuery === '') return
        fetchRestaurants()
    }

    const handleSearchKeyChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.value === '') fetchRestaurants()
        console.log(searchQuery)
        setSearchQuery(e.target.value)
    }

    return (
        <div className="max-w-7xl mx-auto my-5">
            <div className="flex flex-col md:flex-row justify-between gap-10">
                <Filter filterArray={selectedFilters} setSelectedFilters={setSelectedFilters} />
                <div className="flex-1">
                    <div className="relative flex items-center gap-1">
                        <div className="w-full">
                            <SearchIcon className="absolute text-gray-500 inset-y-3 left-2" />
                            <input
                                type="text"
                                value={searchQuery}
                                placeholder="Search by restaurant & cuisines"
                                onChange={(e) => handleSearchKeyChange(e)}
                                onKeyPress={(e) => e.key === 'Enter' && fetchRestaurants()}
                                className="border-2 pl-10 h-11 w-full border-black shadow-lg rounded-lg"
                            />
                        </div>
                        <Button
                            onClick={handleSearch}
                            variant="contained"
                            disabled={isLoading}
                            className="bg-orange-500 w-32"
                        >
                            {isLoading ? <LoaderCircle /> : 'Search'}
                        </Button>
                    </div>

                    <div>
                        <div className="flex flex-wrap gap-2 my-3">
                            {selectedFilters.map((filter, index) => (
                                <Chip
                                    key={index}
                                    label={filter}
                                    variant="outlined"
                                    onDelete={() => handleDeleteChip(filter)}
                                />
                            ))}
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="grid md:grid-cols-3 gap-4">
                            <RestaurantCardSkeleton />
                            <RestaurantCardSkeleton />
                        </div>
                    ) : searchResults.length ? (
                        <div className="grid md:grid-cols-3 gap-4">
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
                </div>
            </div>
        </div>
    )
}

export default SearchResult
