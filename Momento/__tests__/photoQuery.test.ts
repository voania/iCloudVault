import type { Photo, PhotoFilter } from '../src/types';
import { groupPhotosByLocation, groupPhotosByMonth, queryPhotos } from '../src/utils/photoQuery';

function makePhoto(id: string, patch: Partial<Photo> = {}): Photo {
  return {
    id,
    uri: `file://${id}.jpg`,
    filename: `${id}.jpg`,
    sizeBytes: 1000,
    width: 100,
    height: 100,
    createdAt: 1000,
    dateTaken: '2026-05-01',
    timeTaken: '10:00:00',
    latitude: null,
    longitude: null,
    locationName: null,
    exif: { width: 100, height: 100 },
    color: '#ffffff',
    isFavorite: false,
    isHidden: false,
    isPinned: false,
    isDeleted: false,
    aiTags: null,
    aiCategory: null,
    faceCount: null,
    phash: null,
    embedding: null,
    duplicateOfId: null,
    edits: {
      brightness: 0,
      contrast: 0,
      saturation: 0,
      rotation: 0,
      crop: null,
      filter: null,
    },
    versions: [],
    rating: 0,
    mediaType: 'photo',
    duration: null,
    ...patch,
  };
}

const defaultFilter: PhotoFilter = {
  category: null,
  isFavorite: null,
  mediaType: null,
  dateRange: null,
  location: null,
  searchQuery: '',
};

describe('photoQuery', () => {
  it('filters, searches, sorts, and limits photos', () => {
    const photos = [
      makePhoto('deleted', { isDeleted: true, createdAt: 9999 }),
      makePhoto('a', {
        filename: 'family-beach.jpg',
        aiTags: ['family', 'sunset'],
        aiCategory: 'person',
        isFavorite: true,
        createdAt: 300,
      }),
      makePhoto('b', {
        filename: 'receipt.jpg',
        aiCategory: 'document',
        mediaType: 'video',
        createdAt: 200,
      }),
      makePhoto('c', {
        filename: 'mountain.jpg',
        memo: 'quiet sunset hike',
        aiCategory: 'landscape',
        isFavorite: true,
        createdAt: 100,
      }),
    ];

    const result = queryPhotos({
      photos,
      filter: {
        ...defaultFilter,
        isFavorite: true,
        searchQuery: 'sunset',
      },
      sortMode: 'date-asc',
      options: { limit: 1 },
    });

    expect(result.map((photo) => photo.id)).toEqual(['c']);
  });

  it('matches date range, media type, and location filters', () => {
    const photos = [
      makePhoto('inside', {
        dateTaken: '2026-05-10',
        mediaType: 'video',
        locationName: 'Shanghai',
      }),
      makePhoto('outside-date', {
        dateTaken: '2026-06-01',
        mediaType: 'video',
        locationName: 'Shanghai',
      }),
      makePhoto('outside-type', {
        dateTaken: '2026-05-10',
        mediaType: 'photo',
        locationName: 'Shanghai',
      }),
    ];

    const result = queryPhotos({
      photos,
      filter: {
        ...defaultFilter,
        mediaType: 'video',
        location: 'Shang',
        dateRange: { start: '2026-05-01', end: '2026-05-31' },
      },
      sortMode: 'date-desc',
    });

    expect(result.map((photo) => photo.id)).toEqual(['inside']);
  });

  it('returns cached result for identical query inputs', () => {
    const photos = [makePhoto('a'), makePhoto('b')];
    const first = queryPhotos({ photos, filter: defaultFilter, sortMode: 'date-desc' });
    const second = queryPhotos({ photos, filter: defaultFilter, sortMode: 'date-desc' });

    expect(second).toBe(first);
  });

  it('groups photos by month and location', () => {
    const photos = [
      makePhoto('a', {
        dateTaken: '2026-05-10',
        latitude: 31.2,
        longitude: 121.5,
        locationName: 'Shanghai',
      }),
      makePhoto('b', {
        dateTaken: '2026-05-11',
        latitude: 31.21,
        longitude: 121.51,
        locationName: 'Shanghai',
      }),
      makePhoto('c', {
        dateTaken: '2026-04-01',
        latitude: 30.2,
        longitude: 120.1,
        locationName: 'Hangzhou',
      }),
    ];

    expect(groupPhotosByMonth(photos).map((group) => group.month)).toEqual([
      '2026-05',
      '2026-04',
    ]);
    expect(groupPhotosByLocation(photos).map((group) => group.location)).toEqual([
      'Shanghai',
      'Hangzhou',
    ]);
  });
});
