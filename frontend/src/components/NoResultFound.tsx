import { Button, Card, CardContent, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

export const NoResultFound = ({
    searchText,
    searchQuery,
    filterList = []
}: {
    searchText: string;
    searchQuery: string;
    filterList: string[];
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
                    <Button variant="contained" className="mt-4 bg-orange hover:bg-orangeHover">
                        Go Back to Home
                    </Button>
                </Link>
            </CardContent>
        </Card>
    );
};
