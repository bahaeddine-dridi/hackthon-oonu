import { useState, useCallback } from 'react';
import { handleApiError } from '../utils/helpers';

interface UseApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
  initialLoading?: boolean;
}

export function useApi<T = any>(
  apiFunction: (...args: any[]) => Promise<T>,
  options: UseApiOptions<T> = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(options.initialLoading ?? false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (...args: any[]) => {
      try {
        setLoading(true);
        setError(null);
        
        const result = await apiFunction(...args);
        setData(result);
        
        if (options.onSuccess) {
          options.onSuccess(result);
        }
        
        return result;
      } catch (err) {
        const errorMessage = handleApiError(err);
        setError(errorMessage);
        
        if (options.onError) {
          options.onError(errorMessage);
        }
        
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiFunction, options]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
    setData,
  };
}
