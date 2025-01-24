import { SyntheticEvent } from 'react';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';

interface IStarRatingProps {
    ratingValue: number;
    isReadOnly: boolean;
    handleRatingChange?: (event: SyntheticEvent<Element, Event>, value: number | null) => void;
}

const StarRating: React.FC<IStarRatingProps> = ({ ratingValue, isReadOnly = true, handleRatingChange }) => {
    return (
        <Stack spacing={1}>
            <Rating
                name="half-rating"
                value={ratingValue} // Use `value` instead of `defaultValue`
                precision={0.5}
                onChange={handleRatingChange}
                readOnly={isReadOnly}
            />
        </Stack>
    );
};

export default StarRating;
