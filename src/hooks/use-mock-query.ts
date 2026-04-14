"use client";

import { useEffect, useState } from "react";

type AsyncLoader<T> = () => Promise<T>;

export function useMockQuery<T>(loader: AsyncLoader<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let active = true;

    loader()
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

    return () => {
      active = false;
    };
  }, [loader]);

  return { data, loading, error };
}
