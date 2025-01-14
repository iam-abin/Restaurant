import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import CustomButton from '../Button/CustomButton';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

interface IConfirmationDialogueProps {
    open: boolean;
    setOpen: (value: boolean) => void;
    title: string;
    description: string;
    onAgree: () => void;
    onDisagree?: () => void;
    closeText?: string;
    okayText?: string;
}

const ConfirmationDialogue: React.FC<IConfirmationDialogueProps> = ({
    open,
    setOpen,
    title,
    description,
    onAgree,
    onDisagree,
    closeText = 'Close',
    okayText = 'Agree',
}) => {
    const handleClose = (): void => {
        setOpen(false);
    };

    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-labelledby="dialog-title"
            aria-describedby="dialog-description"
            sx={{
                '& .MuiDialog-container': {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                },
                '& .MuiPaper-root': {
                    width: '100%',
                    maxWidth: '400px', // Set the maximum width of the dialog
                    padding: '16px', // Add padding
                    borderRadius: '12px', // Add rounded corners
                    backgroundColor: '#f5f5f5', // Change background color
                    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)', // Add a shadow
                },
            }}
        >
            <DialogTitle
                id="dialog-title"
                sx={{
                    textAlign: 'center',
                    fontSize: '1.25rem',
                    fontWeight: 'bold',
                    color: '#333',
                }}
            >
                {title}
            </DialogTitle>
            <DialogContent
                sx={{
                    textAlign: 'center',
                    color: '#666',
                }}
            >
                <DialogContentText id="dialog-description">{description}</DialogContentText>
            </DialogContent>
            <DialogActions
                sx={{
                    justifyContent: 'center',
                    padding: '16px',
                }}
            >
                <CustomButton
                    onClick={() => {
                        onDisagree?.();
                        handleClose();
                    }}
                    sx={{
                        backgroundColor: '#D10000',
                        '&:hover': {
                            backgroundColor: '#A30000',
                        },
                        fontWeight: 'bold',
                    }}
                >
                    {closeText}
                </CustomButton>
                <CustomButton
                    onClick={() => {
                        onAgree();
                        handleClose();
                    }}
                    sx={{
                        backgroundColor: '#3B9212',
                        '&:hover': {
                            backgroundColor: '#2B690D',
                        },
                    }}
                >
                    {okayText}
                </CustomButton>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmationDialogue;
