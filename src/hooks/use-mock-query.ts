"use client";

import { useEffect, useState } from "react";

type AsyncLoader<T> = () => Promise<T>;
type QueryOptions = {
  refetchIntervalMs?: number;
};

type CacheEntry<T> = {
  data: T;
  updatedAt: number;
};

const CACHE_STALE_MS = 60_000;
const queryCache = new WeakMap<AsyncLoader<unknown>, CacheEntry<unknown>>();
const inFlight = new WeakMap<AsyncLoader<unknown>, Promise<unknown>>();

export function useMockQuery<T>(loader: AsyncLoader<T>, options?: QueryOptions) {
  const refetchIntervalMs = options?.refetchIntervalMs ?? 0;
  const cachedEntry = queryCache.get(loader as AsyncLoader<unknown>) as CacheEntry<T> | undefined;
  const cachedData = cachedEntry?.data ?? null;

  const [data, setData] = useState<T | null>(cachedData);
  const [loading, setLoading] = useState(cachedData === null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let active = true;

    const now = Date.now();
    const currentCache = queryCache.get(loader as AsyncLoader<unknown>) as CacheEntry<T> | undefined;

    if (currentCache) {
      setData(currentCache.data);
      setLoading(false);
      setError(null);

      if (now - currentCache.updatedAt < CACHE_STALE_MS) {
        return () => {
          active = false;
        };
      }
    } else {
      setLoading(true);
    }

    setError(null);

    const executeLoad = () =>
      (inFlight.get(loader as AsyncLoader<unknown>) as Promise<T> | undefined) ??
      loader()
        .then((result) => {
          queryCache.set(loader as AsyncLoader<unknown>, {
            data: result,
            updatedAt: Date.now()
          });
          return result;
        })
        .finally(() => {
          inFlight.delete(loader as AsyncLoader<unknown>);
        });

    const sharedPromise = executeLoad();

    if (!inFlight.get(loader as AsyncLoader<unknown>)) {
      inFlight.set(loader as AsyncLoader<unknown>, sharedPromise as Promise<unknown>);
    }

    sharedPromise
      .then((result) => {
        if (!active) return;
        setData(result);
        setLoading(false);
      })
      .catch((err: Error) => {
        if (!active) return;
        setError(err);
        setLoading(false);
      });

    let intervalId: number | undefined;
    if (refetchIntervalMs > 0) {
      intervalId = window.setInterval(() => {
        const intervalPromise = executeLoad();

        if (!inFlight.get(loader as AsyncLoader<unknown>)) {
          inFlight.set(loader as AsyncLoader<unknown>, intervalPromise as Promise<unknown>);
        }

        intervalPromise
          .then((result) => {
            if (!active) return;
            setData(result);
            setError(null);
          })
          .catch((err: Error) => {
            if (!active) return;
            setError(err);
          });
      }, refetchIntervalMs);
    }

    return () => {
      active = false;
      if (intervalId) {
        window.clearInterval(intervalId);
      }
    };
  }, [loader, refetchIntervalMs]);

  return { data, loading, error };
}
