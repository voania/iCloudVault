import { create } from 'zustand';
import type { Photo, PhotoFilter, SortMode } from '../types';
import { getDatabase } from '../db';
import { logError } from '../utils/logger';
import { queryPhotos } from '../utils/photoQuery';

interface PhotoState {
  photos: Photo[];
  photoMap: Map<string, Photo>;
  sortMode: SortMode;
  filter: PhotoFilter;
  selectionMode: boolean;
  selectedIds: Set<string>;
  isGridReady: boolean;
  isHydrated: boolean;

  setPhotos: (photos: Photo[]) => void;
  addPhotos: (photos: Photo[]) => void;
  updatePhoto: (id: string, patch: Partial<Photo>) => void;
  updatePhotos: (patches: Array<{ id: string; patch: Partial<Photo> }>) => void;
  removePhotos: (ids: string[]) => void;

  setSortMode: (mode: SortMode) => void;
  setFilter: (patch: Partial<PhotoFilter>) => void;
  resetFilter: () => void;

  toggleSelection: (id: string) => void;
  selectAll: (ids: string[]) => void;
  clearSelection: () => void;
  enterSelection: () => void;
  exitSelection: () => void;

  batchFavorite: () => void;
  batchDelete: () => void;
  batchHide: () => void;

  getFilteredPhotos: () => Photo[];
  getPhotoById: (id: string) => Photo | undefined;

  hydrateFromDb: () => Promise<void>;
}

const PHOTO_MEMOS_KV_KEY = 'photo-memos';

const defaultFilter: PhotoFilter = {
  category: null,
  isFavorite: null,
  mediaType: null,
  dateRange: null,
  location: null,
  searchQuery: '',
};

const dbCatch = (op: string) => (err: unknown) => logError(`photoStore.${op}`, err);
const createPhotoMap = (photos: Photo[]) => new Map(photos.map((photo) => [photo.id, photo]));

export const usePhotoStore = create<PhotoState>((set, get) => ({
  photos: [],
  photoMap: new Map(),
  sortMode: 'date-desc',
  filter: { ...defaultFilter },
  selectionMode: false,
  selectedIds: new Set(),
  isGridReady: false,
  isHydrated: false,

  hydrateFromDb: async () => {
    try {
      const db = getDatabase();
      const [photos, memoMap] = await Promise.all([
        db.getAllPhotos(),
        db.kvGet<Record<string, string>>(PHOTO_MEMOS_KV_KEY, {}),
      ]);
      const hydratedPhotos = photos.map((photo) => ({
        ...photo,
        memo: memoMap[photo.id] ?? photo.memo,
      }));
      set({
        photos: hydratedPhotos,
        photoMap: createPhotoMap(hydratedPhotos),
        isGridReady: true,
        isHydrated: true,
      });
    } catch (err) {
      logError('hydrateFromDb', err);
      set({ isGridReady: true, isHydrated: true });
    }
  },

  setPhotos: (photos) => set({
    photos,
    photoMap: createPhotoMap(photos),
    isGridReady: true,
    isHydrated: true,
  }),
  addPhotos: (photos) => {
    set((s) => {
      const nextPhotos = [...photos, ...s.photos];
      return { photos: nextPhotos, photoMap: createPhotoMap(nextPhotos) };
    });
    getDatabase().insertPhotos(photos).catch(dbCatch('insertPhotos'));
  },
  updatePhoto: (id, patch) => {
    set((s) => {
      let updatedPhoto: Photo | null = null;
      const nextPhotos = s.photos.map((p) => {
        if (p.id !== id) return p;
        updatedPhoto = { ...p, ...patch };
        return updatedPhoto;
      });
      if (!updatedPhoto) {
        return { photos: nextPhotos };
      }
      const nextPhotoMap = new Map(s.photoMap);
      nextPhotoMap.set(id, updatedPhoto);
      return { photos: nextPhotos, photoMap: nextPhotoMap };
    });
    getDatabase().updatePhoto(id, patch).catch(dbCatch('updatePhoto'));
    if (Object.prototype.hasOwnProperty.call(patch, 'memo')) {
      getDatabase()
        .kvGet<Record<string, string>>(PHOTO_MEMOS_KV_KEY, {})
        .then((memoMap) => {
          const nextMemoMap = { ...memoMap };
          const nextMemo = patch.memo?.trim();
          if (nextMemo) {
            nextMemoMap[id] = nextMemo;
          } else {
            delete nextMemoMap[id];
          }
          return getDatabase().kvSet(PHOTO_MEMOS_KV_KEY, nextMemoMap);
        })
        .catch(dbCatch('updatePhotoMemo'));
    }
  },
  updatePhotos: (patches) => {
    if (patches.length === 0) return;
    const patchMap = new Map(patches.map(({ id, patch }) => [id, patch]));
    set((s) => {
      let changed = false;
      const nextPhotoMap = new Map(s.photoMap);
      const nextPhotos = s.photos.map((photo) => {
        const patch = patchMap.get(photo.id);
        if (!patch) return photo;
        const updated = { ...photo, ...patch };
        nextPhotoMap.set(photo.id, updated);
        changed = true;
        return updated;
      });
      return changed ? { photos: nextPhotos, photoMap: nextPhotoMap } : {};
    });
    getDatabase().updatePhotos(patches).catch(dbCatch('updatePhotos'));
  },
  removePhotos: (ids) => {
    set((s) => {
      const nextPhotos = s.photos.filter((p) => !ids.includes(p.id));
      return {
        photos: nextPhotos,
        photoMap: createPhotoMap(nextPhotos),
        selectedIds: new Set([...s.selectedIds].filter((sid) => !ids.includes(sid))),
      };
    });
    getDatabase().deletePhotos(ids).catch(dbCatch('deletePhotos'));
  },

  setSortMode: (mode) => set({ sortMode: mode }),
  setFilter: (patch) => set((s) => ({ filter: { ...s.filter, ...patch } })),
  resetFilter: () => set({ filter: { ...defaultFilter } }),

  toggleSelection: (id) =>
    set((s) => {
      const next = new Set(s.selectedIds);
      next.has(id) ? next.delete(id) : next.add(id);
      return { selectedIds: next };
    }),
  selectAll: (ids) => set({ selectedIds: new Set(ids) }),
  clearSelection: () => set({ selectedIds: new Set(), selectionMode: false }),
  enterSelection: () => set({ selectionMode: true, selectedIds: new Set() }),
  exitSelection: () => set({ selectionMode: false, selectedIds: new Set() }),

  batchFavorite: () => {
    const { photos, selectedIds } = get();
    const allFav = [...selectedIds].every((id) => photos.find((p) => p.id === id)?.isFavorite);
    set((s) => {
      const nextPhotos = s.photos.map((p) =>
        selectedIds.has(p.id) ? { ...p, isFavorite: !allFav } : p,
      );
      return {
        photos: nextPhotos,
        photoMap: createPhotoMap(nextPhotos),
        selectedIds: new Set(),
        selectionMode: false,
      };
    });
    getDatabase()
      .updatePhotos([...selectedIds].map((id) => ({ id, patch: { isFavorite: !allFav } })))
      .catch(dbCatch('batchFavorite'));
  },
  batchDelete: () => {
    const { selectedIds } = get();
    const deletedAt = Date.now();
    set((s) => {
      const nextPhotos = s.photos.map((p) =>
        selectedIds.has(p.id) ? { ...p, isDeleted: true, deletedAt } : p,
      );
      return {
        photos: nextPhotos,
        photoMap: createPhotoMap(nextPhotos),
        selectedIds: new Set(),
        selectionMode: false,
      };
    });
    getDatabase()
      .updatePhotos([...selectedIds].map((id) => ({ id, patch: { isDeleted: true, deletedAt } })))
      .catch(dbCatch('batchDelete'));
  },
  batchHide: () => {
    const { selectedIds } = get();
    set((s) => {
      const nextPhotos = s.photos.map((p) =>
        selectedIds.has(p.id) ? { ...p, isHidden: true } : p,
      );
      return {
        photos: nextPhotos,
        photoMap: createPhotoMap(nextPhotos),
        selectedIds: new Set(),
        selectionMode: false,
      };
    });
    getDatabase()
      .updatePhotos([...selectedIds].map((id) => ({ id, patch: { isHidden: true } })))
      .catch(dbCatch('batchHide'));
  },

  getFilteredPhotos: () => {
    const { photos, sortMode, filter } = get();
    return queryPhotos({ photos, filter, sortMode });
  },

  getPhotoById: (id) => get().photoMap.get(id),
}));
