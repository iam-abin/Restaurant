import { debounce } from 'lodash';
import { useEffect, useState } from 'react';

interface ISearchBarProps {
    onSearch: (searchTerm: string) => void;
    placeholder: string;
    className?: string;
}

const SearchBar: React.FC<ISearchBarProps> = ({ placeholder, onSearch, className }) => {
    const [searchKey, setSearchKey] = useState('');

    // Create a debounced version of onSearch() function
    const debouncedOnSearch = debounce(onSearch, 800);

    // Update debouncedSearchKey after a delay
    useEffect(() => {
        // Call the debounced function when searchKey changes
        debouncedOnSearch(searchKey);

        // Cleanup function to cancel the debounce if the component unmounts
        return () => {
            debouncedOnSearch.cancel();
        };
    }, [searchKey, debouncedOnSearch]);

    return (
        <input
            type="text"
            placeholder={placeholder}
            className={`${className ? className : 'px-4 py-2 border w-4/12 border-gray-300 rounded-md'}`}
            onChange={(e) => setSearchKey(e.target.value.trim())}
        />
    );
};

export default SearchBar;
