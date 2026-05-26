import type { Photo, PhotoFilter, SortMode, Category } from '../types';

interface PhotoQueryOptions {
  category?: Category | null;
  favoriteOnly?: boolean;
  sort?: SortMode;
  limit?: number;
}

interface PhotoQueryInput {
  photos: Photo[];
  filter: PhotoFilter;
  sortMode: SortMode;
  options?: PhotoQueryOptions;
}

interface PhotoQueryCacheEntry {
  photos: Photo[];
  filter: PhotoFilter;
  sortMode: SortMode;
  optionKey: string;
  result: Photo[];
}

const SEARCH_TEXT_CACHE = new WeakMap<Photo, string>();
let lastQuery: PhotoQueryCacheEntry | null = null;
let lastMonthGroups: { photos: Photo[]; result: Array<{ month: string; items: Photo[] }> } | null = null;
let lastLocationGroups:
  | {
      photos: Photo[];
      result: Array<{
        location: string;
        latitude: number;
        longitude: number;
        items: Photo[];
      }>;
    }
  | null = null;

function getOptionKey(options: PhotoQueryOptions = {}): string {
  return [
    options.category ?? '',
    options.favoriteOnly === undefined ? '' : String(options.favoriteOnly),
    options.sort ?? '',
    options.limit ?? '',
  ].join('|');
}

function getSearchText(photo: Photo): string {
  const cached = SEARCH_TEXT_CACHE.get(photo);
  if (cached) {
    return cached;
  }

  const text = [
    photo.filename,
    photo.locationName,
    photo.memo,
    photo.dateTaken,
    ...(photo.aiTags ?? []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  SEARCH_TEXT_CACHE.set(photo, text);
  return text;
}

function matchesDateRange(photo: Photo, filter: PhotoFilter): boolean {
  if (!filter.dateRange) {
    return true;
  }

  return photo.dateTaken >= filter.dateRange.start && photo.dateTaken <= filter.dateRange.end;
}

function comparePhotos(sortMode: SortMode): (a: Photo, b: Photo) => number {
  switch (sortMode) {
    case 'date-asc':
      return (a, b) => a.createdAt - b.createdAt;
    case 'name':
      return (a, b) => a.filename.localeCompare(b.filename);
    case 'size':
      return (a, b) => a.sizeBytes - b.sizeBytes;
    case 'date-desc':
    default:
      return (a, b) => b.createdAt - a.createdAt;
  }
}

export function queryPhotos({
  photos,
  filter,
  sortMode,
  options = {},
}: PhotoQueryInput): Photo[] {
  const optionKey = getOptionKey(options);

  if (
    lastQuery &&
    lastQuery.photos === photos &&
    lastQuery.filter === filter &&
    lastQuery.sortMode === sortMode &&
    lastQuery.optionKey === optionKey
  ) {
    return lastQuery.result;
  }

  const category = options.category ?? filter.category;
  const favoriteOnly = options.favoriteOnly ?? filter.isFavorite;
  const effectiveSort = options.sort ?? sortMode;
  const searchQuery = filter.searchQuery.trim().toLowerCase();

  const result: Photo[] = [];
  for (const photo of photos) {
    if (photo.isDeleted) continue;
    if (category && photo.aiCategory !== category) continue;
    if (favoriteOnly && !photo.isFavorite) continue;
    if (filter.mediaType && photo.mediaType !== filter.mediaType) continue;
    if (filter.location && !photo.locationName?.includes(filter.location)) continue;
    if (!matchesDateRange(photo, filter)) continue;
    if (searchQuery && !getSearchText(photo).includes(searchQuery)) continue;
    result.push(photo);
  }

  result.sort(comparePhotos(effectiveSort));
  const finalResult = options.limit ? result.slice(0, options.limit) : result;

  lastQuery = {
    photos,
    filter,
    sortMode,
    optionKey,
    result: finalResult,
  };

  return finalResult;
}

export function groupPhotosByMonth(photos: Photo[]): Array<{ month: string; items: Photo[] }> {
  if (lastMonthGroups?.photos === photos) {
    return lastMonthGroups.result;
  }

  const groups = new Map<string, Photo[]>();
  for (const photo of photos) {
    const month = photo.dateTaken.slice(0, 7);
    const items = groups.get(month);
    if (items) {
      items.push(photo);
    } else {
      groups.set(month, [photo]);
    }
  }

  const result = Array.from(groups.entries())
    .map(([month, items]) => ({ month, items }))
    .sort((a, b) => b.month.localeCompare(a.month));

  lastMonthGroups = { photos, result };
  return result;
}

export function groupPhotosByLocation(
  photos: Photo[],
): Array<{ location: string; latitude: number; longitude: number; items: Photo[] }> {
  if (lastLocationGroups?.photos === photos) {
    return lastLocationGroups.result;
  }

  const groups = new Map<string, Photo[]>();
  for (const photo of photos) {
    if (!photo.latitude || !photo.longitude) continue;
    const key = photo.locationName || `${photo.latitude.toFixed(4)},${photo.longitude.toFixed(4)}`;
    const items = groups.get(key);
    if (items) {
      items.push(photo);
    } else {
      groups.set(key, [photo]);
    }
  }

  const result = Array.from(groups.entries()).map(([location, items]) => ({
    location,
    latitude: items[0].latitude!,
    longitude: items[0].longitude!,
    items,
  }));

  lastLocationGroups = { photos, result };
  return result;
}
