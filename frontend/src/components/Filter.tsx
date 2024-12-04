import { Button, Checkbox } from '@mui/material';

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
}: {
    filterArray: string[];
    setSelectedFilters: React.Dispatch<React.SetStateAction<string[]>>;
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
        <div className="md:w-72">
            <div className="flex items-center justify-between">
                <h1 className="font-medium text-lg">Filter by cuisines</h1>
                <Button onClick={resetFilters}>Reset</Button>
            </div>
            {filterOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-2 my-5">
                    <Checkbox
                        id={option.id}
                        checked={filterArray.includes(option.label)}
                        onChange={() => applyFilterCheck(option.label)}
                    />
                    <label htmlFor={option.id} className="text-sm font-medium leading-none cursor-pointer">
                        {option.label}
                    </label>
                </div>
            ))}
        </div>
    );
};

export default Filter;
