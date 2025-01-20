import { Checkbox } from '@mui/material';
import { ICuisineResponse1 } from '../../types';
import CustomButton from '../Button/CustomButton';

interface IFiterProps {
    filterArray: string[];
    setSelectedFilters: React.Dispatch<React.SetStateAction<string[]>>;
    filtersList: ICuisineResponse1[];
}
const Filter: React.FC<IFiterProps> = ({ filterArray, setSelectedFilters, filtersList }) => {
    const applyFilterCheck = (item: string) => {
        setSelectedFilters((prevFilters) =>
            prevFilters.includes(item)
                ? prevFilters.filter((filter) => filter !== item)
                : [...prevFilters, item],
        );
    };

    const resetFilters = (): void => {
        setSelectedFilters([]);
    };

    return (
        <div className="w-52">
            <div className="flex items-center justify-between">
                <h1 className="font-medium text-lg">Filter by cuisines</h1>
                <CustomButton onClick={resetFilters} variant="text">
                    Reset
                </CustomButton>
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
