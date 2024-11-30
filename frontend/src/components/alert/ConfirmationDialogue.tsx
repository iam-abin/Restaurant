import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});
export default function ConfirmationDialogue({
    open,
    setOpen,
    title,
    description,
    onAgree,
    onDisagree,
    closeText = 'Close',
    okayText = 'Agree',
}: {
    open: boolean;
    setOpen: (value: boolean) => void;
    title: string;
    description: string;
    onAgree: () => void;
    onDisagree?: () => void;
    closeText?: string;
    okayText?: string;
}) {
    const handleClose = () => {
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
        >
            <div className="flex flex-col items-center">
                <DialogTitle id="dialog-title">{title}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="dialog-description">{description}</DialogContentText>
                </DialogContent>
            </div>
            <DialogActions>
                <Button
                    onClick={() => {
                        onDisagree?.();
                        handleClose();
                    }}
                >
                    {closeText}
                </Button>
                <Button
                    onClick={() => {
                        onAgree();
                        handleClose();
                    }}
                    color="primary"
                >
                    {okayText}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
