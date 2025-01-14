import { Card, CardContent, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import CustomButton from './Button/CustomButton';

interface INoResultFoundProps {
    searchText: string;
    searchQuery: string;
    filterList: string[];
}

export const NoResultFound: React.FC<INoResultFoundProps> = ({
    searchText,
    searchQuery,
    filterList = [],
}) => {
    return (
        <Card className="max-w-md mx-auto mt-10 shadow-lg">
            <CardContent className="text-center">
                <Typography variant="h5" component="h1" className="font-semibold text-gray-700">
                    No results found
                </Typography>
                <Typography className="mt-2 text-gray-500 dark:text-gray-400">
                    We couldn&apos;t find any results for &apos;{searchText}&apos;
                    {searchQuery && (
                        <>
                            {filterList.length ? ',' : ' and'} &apos;{searchQuery}&apos;
                        </>
                    )}
                    {filterList.length > 0 && <>and &apos;{filterList.join(', ')}&apos;</>}
                    . <br />
                    Try searching with a different term.
                </Typography>
                <Link to="/" className="text-decoration-none">
                    <CustomButton>Go Back to Home</CustomButton>
                </Link>
            </CardContent>
        </Card>
    );
};
