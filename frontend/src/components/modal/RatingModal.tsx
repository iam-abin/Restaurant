import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import StarRating from '../rating/StarRating';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

interface IRatingModalProps {
    isModalOpen: boolean;
    closeRatingModal: () => void;
    myRating: number;
    handleRatingChange: (event: React.SyntheticEvent<Element, Event>, value: number | null) => Promise<void>;
}
const RatingModal: React.FC<IRatingModalProps> = ({
    isModalOpen,
    closeRatingModal,
    myRating,
    handleRatingChange,
}) => {
    return (
        <div>
            <Modal
                open={isModalOpen}
                onClose={closeRatingModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Rate this restaurant
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        <StarRating
                            ratingValue={myRating}
                            isReadOnly={false}
                            handleRatingChange={handleRatingChange}
                        />
                    </Typography>
                </Box>
            </Modal>
        </div>
    );
};

export default RatingModal;
