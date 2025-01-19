import { useState } from 'react';
import ConfirmationDialogue from '../components/alert/ConfirmationDialogue';

interface UseConfirmationOptions {
    title: string;
    description: string;
    onAgree: () => void;
    onDisagree?: () => void;
    closeText?: string;
    okayText?: string;
}

export const useConfirmation = () => {
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState<UseConfirmationOptions | null>(null);

    const showConfirmation = (newOptions: UseConfirmationOptions): void => {
        setOptions(newOptions);
        setOpen(true);
    };

    const ConfirmationAlert = (): JSX.Element | null =>
        options && (
            <ConfirmationDialogue
                open={open}
                setOpen={setOpen}
                title={options.title}
                description={options.description}
                onAgree={() => {
                    options.onAgree();
                    setOpen(false);
                }}
                onDisagree={() => {
                    options.onDisagree?.();
                    setOpen(false);
                }}
                closeText={options.closeText}
                okayText={options.okayText}
            />
        );

    return { showConfirmation, ConfirmationAlert };
};

export default useConfirmation;
