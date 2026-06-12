"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { ApiError } from "./api";

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * useApi(fetcher)
 * Fires `fetcher()` on mount, tracks loading/error/data.
 * Re-fires when `refetch()` is called.
 *
 * Example:
 *   const { data, loading, error } = useApi(() => walletApi.getSummary());
 */
export function useApi<T>(fetcher: () => Promise<T>): UseApiState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  // Keep stable reference to fetcher
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetcherRef.current()
      .then(res => { if (!cancelled) { setData(res); setLoading(false); } })
      .catch(err => {
        if (!cancelled) {
          const msg = err instanceof ApiError ? err.message : "Something went wrong";
          setError(msg);
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [tick]);

  const refetch = useCallback(() => setTick(t => t + 1), []);

  return { data, loading, error, refetch };
}
