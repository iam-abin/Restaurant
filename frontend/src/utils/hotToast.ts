import toast from 'react-hot-toast';

type HotToast = 'success' | 'warn' | 'error';

/**
 * Displays a toast notification with the specified message and type.
 * Supports success, error, and warning toast types.
 *
 * @param {string} msg - The message to be displayed in the toast notification.
 * @param {HotToast} type - The type of toast to display. Can be 'success', 'warn', or 'error'.
 * @returns {void} This function does not return anything.
 *
 * @example
 * hotToastMessage('Operation successful!', 'success');
 * hotToastMessage('An error occurred', 'error');
 * hotToastMessage('This is a warning!', 'warn');
 */
export const hotToastMessage = (msg: string, type: HotToast): void => {
    switch (type) {
        case 'success':
            toast.success(msg);
            break;

        case 'error':
            toast.error(msg);
            break;
        case 'warn':
            toast(msg, {
                icon: '⚠️',
                style: {
                    border: '1px solid #FFA500',
                    padding: '5px',
                    color: '#00000',
                },
            });
            break;

        default:
            // Default to success for unknown types
            toast.success(msg);
            break;
    }
};
