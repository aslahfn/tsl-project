import { useCallback, useEffect, useRef, useState } from 'react';
import { getErrorMessage } from '../api/client';

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  isEmpty: boolean;
  retry: () => void;
  refresh: () => void;
}

export function useAsyncData<T>(
  fetcher: () => Promise<T>,
  deps: unknown[] = [],
  isEmptyCheck?: (data: T) => boolean,
): AsyncState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetcherRef.current();
      setData(result);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => {
    load();
  }, [load]);

  const isEmpty = data !== null && isEmptyCheck
    ? isEmptyCheck(data)
    : Array.isArray(data)
      ? data.length === 0
      : data === null;

  return {
    data,
    loading,
    error,
    isEmpty,
    retry: load,
    refresh: load,
  };
}
