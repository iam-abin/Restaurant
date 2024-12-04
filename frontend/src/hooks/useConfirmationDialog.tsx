import { useState, useCallback } from 'react';

interface UseConfirmationDialogProps {
    onAgree: () => void;
    onDisagree?: () => void;
}
