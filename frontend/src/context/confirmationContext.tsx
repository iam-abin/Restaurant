import React, { createContext, useContext, useState } from 'react';
import ConfirmationDialogue from '../components/alert/ConfirmationDialogue';

interface ConfirmationOptions {
    title: string;
    description: string;
    onAgree: () => void;
    onDisagree?: () => void;
    closeText?: string;
    okayText?: string;
}

interface ConfirmationContextProps {
    showConfirmation: (options: ConfirmationOptions) => void;
}

const ConfirmationContext = createContext<ConfirmationContextProps | undefined>(undefined);

export const ConfirmationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState<ConfirmationOptions | null>(null);

    const showConfirmation = (newOptions: ConfirmationOptions) => {
        setOptions(newOptions);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <ConfirmationContext.Provider value={{ showConfirmation }}>
            {children}
            {options && (
                <ConfirmationDialogue
                    open={open}
                    setOpen={setOpen}
                    title={options.title}
                    description={options.description}
                    onAgree={() => {
                        options.onAgree();
                        handleClose();
                    }}
                    onDisagree={() => {
                        options.onDisagree?.();
                        handleClose();
                    }}
                    closeText={options.closeText}
                    okayText={options.okayText}
                />
            )}
        </ConfirmationContext.Provider>
    );
};

export const useConfirmationContext = (): ConfirmationContextProps => {
    const context = useContext(ConfirmationContext);
    if (!context) {
        throw new Error('useConfirmationContext must be used within a ConfirmationProvider');
    }
    return context;
};
