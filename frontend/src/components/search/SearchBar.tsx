import { useEffect, useState } from 'react';

interface ISearchBarProps {
    onSearch: (searchTerm: string) => void;
    placeholder: string;
    className?: string;
}

const SearchBar: React.FC<ISearchBarProps> = ({ placeholder, onSearch, className }) => {
    const [searchKey, setSearchKey] = useState('');
    const [debouncedSearchKey, setDebouncedSearchKey] = useState('');

    // Update debouncedSearchKey after a delay
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchKey(searchKey);
        }, 500); // 500 ms debounce time

        // Clear timer if searchKey changes before 500 ms
        return () => clearTimeout(timer);
    }, [searchKey]);

    // Trigger search when debouncedSearchKey changes
    useEffect(() => {
        onSearch(debouncedSearchKey);
    }, [debouncedSearchKey, onSearch]);

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
