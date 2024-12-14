import { Button, Checkbox } from '@mui/material';
import { ICuisineResponse1 } from '../types';

export type FilterOptionsState = {
    id: string;
    label: string;
};

const filterOptions: FilterOptionsState[] = [
    { id: 'burger', label: 'Burger' },
    { id: 'indian', label: 'indian' },
    { id: 'biryani', label: 'Biryani' },
    { id: 'momos', label: 'Momos' },
    { id: 'chinese', label: 'chinese' },
    { id: 'african', label: 'african' },
];

const Filter = ({
    filterArray,
    setSelectedFilters,
    filtersList
}: {
    filterArray: string[];
    setSelectedFilters: React.Dispatch<React.SetStateAction<string[]>>;
    filtersList: ICuisineResponse1[]
}) => {
    const applyFilterCheck = (item: string) => {
        setSelectedFilters((prevFilters) =>
            prevFilters.includes(item)
                ? prevFilters.filter((filter) => filter !== item)
                : [...prevFilters, item],
        );
    };

    const resetFilters = () => {
        setSelectedFilters([]);
    };

    return (
        <div className="sm:w-52 md:w-64">
            <div className="flex items-center justify-between">
                <h1 className="font-medium text-lg">Filter by cuisines</h1>
                <Button onClick={resetFilters}>Reset</Button>
            </div>
            {filtersList.map((option) => (
                <div key={option._id} className="flex items-center space-x-2 my-5">
                    <Checkbox
                        id={option._id}
                        checked={filterArray.includes(option.name)}
                        onChange={() => applyFilterCheck(option.name)}
                    />
                    <label htmlFor={option._id} className="text-sm font-medium leading-none cursor-pointer">
                        {option.name}
                    </label>
                </div>
            ))}
        </div>
    );
};

export default Filter;
