import { useCallback, useEffect, useMemo, useState } from 'react';

interface IncrementalListOptions {
  initialCount?: number;
  pageSize?: number;
}

export function useIncrementalList<T>(
  items: T[],
  options: IncrementalListOptions = {},
) {
  const { initialCount = 40, pageSize = 30 } = options;
  const [visibleCount, setVisibleCount] = useState(initialCount);

  useEffect(() => {
    setVisibleCount(initialCount);
  }, [items, initialCount]);

  const visibleItems = useMemo(
    () => items.slice(0, Math.min(visibleCount, items.length)),
    [items, visibleCount],
  );

  const hasMore = visibleItems.length < items.length;

  const loadMore = useCallback(() => {
    if (!hasMore) return;
    setVisibleCount((count) => Math.min(count + pageSize, items.length));
  }, [hasMore, items.length, pageSize]);

  return { visibleItems, hasMore, loadMore };
}
