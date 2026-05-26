import { setDatabase, type IDatabase } from '../src/db';
import { usePhotoStore } from '../src/store';
import type { Album, Photo } from '../src/types';

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

function createMockDatabase(): IDatabase {
  return {
    getAllPhotos: jest.fn(async () => []),
    getPhotoById: jest.fn(async () => null),
    insertPhoto: jest.fn(async () => {}),
    insertPhotos: jest.fn(async () => {}),
    updatePhoto: jest.fn(async () => {}),
    updatePhotos: jest.fn(async () => {}),
    deletePhotos: jest.fn(async () => {}),
    getAllAlbums: jest.fn(async () => []),
    getAlbumById: jest.fn(async () => null),
    insertAlbum: jest.fn(async (_album: Album) => {}),
    updateAlbum: jest.fn(async () => {}),
    deleteAlbum: jest.fn(async () => {}),
    addPhotosToAlbum: jest.fn(async () => {}),
    removePhotosFromAlbum: jest.fn(async () => {}),
    kvGet: jest.fn(async (_key, fallback) => fallback),
    kvSet: jest.fn(async () => {}),
    close: jest.fn(async () => {}),
  };
}

function resetPhotoStore() {
  usePhotoStore.setState({
    photos: [],
    photoMap: new Map(),
    sortMode: 'date-desc',
    filter: {
      category: null,
      isFavorite: null,
      mediaType: null,
      dateRange: null,
      location: null,
      searchQuery: '',
    },
    selectionMode: false,
    selectedIds: new Set(),
    isGridReady: false,
    isHydrated: false,
  });
}

describe('photoStore batch paths', () => {
  beforeEach(() => {
    resetPhotoStore();
    setDatabase(createMockDatabase());
  });

  it('adds photos through the batch database API and updates photoMap', () => {
    const photos = [makePhoto('a'), makePhoto('b')];

    usePhotoStore.getState().addPhotos(photos);

    const state = usePhotoStore.getState();
    expect(state.photos.map((photo) => photo.id)).toEqual(['a', 'b']);
    expect(state.photoMap.get('b')?.filename).toBe('b.jpg');
    expect(state.getPhotoById('a')?.id).toBe('a');
  });

  it('updates multiple photos with one store mutation path', () => {
    const a = makePhoto('a');
    const b = makePhoto('b');
    usePhotoStore.getState().setPhotos([a, b]);

    usePhotoStore.getState().updatePhotos([
      { id: 'a', patch: { isFavorite: true } },
      { id: 'b', patch: { aiTags: ['sunset'] } },
    ]);

    const state = usePhotoStore.getState();
    expect(state.photoMap.get('a')?.isFavorite).toBe(true);
    expect(state.photoMap.get('b')?.aiTags).toEqual(['sunset']);
  });
});
