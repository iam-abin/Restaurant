import { useState } from 'react';
import { IResponse } from '../types/api';

interface UseApiRequestResult<T> {
    data: T | null;
    loading: boolean;
    message: string | null;
    fetchData: (...args: any[]) => Promise<void>;
}

// Make api call for non redux state management.
function useApiRequest<T>(apiFunction: (...args: any[]) => Promise<IResponse<T>>): UseApiRequestResult<T> {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string | null>(null);

    const fetchData = async (...args: any[]) => {
        setLoading(true);
        setMessage(null);

        try {
            const response = await apiFunction(...args);
            setData(response.data || null); // Explicitly handle undefined data
            setMessage(response.message || 'Request successful');
        } catch (error: any) {
            setMessage(error.response?.data?.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return { data, loading, message, fetchData };
}

export default useApiRequest;
