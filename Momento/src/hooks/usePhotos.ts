import { useMemo } from 'react';
import { usePhotoStore } from '../store';
import type { Category, SortMode } from '../types';
import { groupPhotosByLocation, groupPhotosByMonth, queryPhotos } from '../utils/photoQuery';

// ============================================================
// usePhotos — 带筛选/排序/分组逻辑的照片查询 hook
// 组件只需调用此 hook，不直接访问 photoStore 内部实现
// ============================================================

interface UsePhotosOptions {
  category?: Category | null;
  favoriteOnly?: boolean;
  sort?: SortMode;
  limit?: number;
}

export function usePhotos(options: UsePhotosOptions = {}) {
  const photos = usePhotoStore((s) => s.photos);
  const sortMode = usePhotoStore((s) => s.sortMode);
  const filter = usePhotoStore((s) => s.filter);

  // 解构 options 字段，避免对象引用不稳定导致 useMemo 频繁重新执行
  const { category: optCategory, favoriteOnly, sort: optSort, limit } = options;

  const result = useMemo(() => {
    return queryPhotos({
      photos,
      filter,
      sortMode,
      options: {
        category: optCategory,
        favoriteOnly,
        sort: optSort,
        limit,
      },
    });
  }, [photos, filter, sortMode, optCategory, favoriteOnly, optSort, limit]);

  return result;
}

// 按月份分组（给时间线视图用）
export function usePhotosGroupedByMonth() {
  const photos = usePhotos();

  return useMemo(() => {
    return groupPhotosByMonth(photos);
  }, [photos]);
}

// 按位置分组（给地图视图用）
export function usePhotosGroupedByLocation() {
  const photos = usePhotos();

  return useMemo(() => {
    return groupPhotosByLocation(photos);
  }, [photos]);
}
