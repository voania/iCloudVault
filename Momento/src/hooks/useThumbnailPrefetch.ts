import { useEffect, useRef, useCallback } from 'react';
import { Image } from 'react-native';
import { usePhotoStore } from '../store';
import { generateThumbnail } from '../utils/image';
import type { Photo } from '../types';

const PREFETCH_BATCH = 20;
const REPAIR_BATCH = 3;
const REPAIR_DELAY = 2000;

export function useThumbnailPrefetch() {
  const photos = usePhotoStore((s) => s.photos);
  const updatePhoto = usePhotoStore((s) => s.updatePhoto);
  const isHydrated = usePhotoStore((s) => s.isHydrated);
  const prefetchedRef = useRef(false);
  const repairQueueRef = useRef<Photo[]>([]);
  const repairingRef = useRef(false);

  useEffect(() => {
    if (!isHydrated || photos.length === 0 || prefetchedRef.current) return;
    prefetchedRef.current = true;

    const batch = photos.slice(0, PREFETCH_BATCH);
    batch.forEach((photo) => {
      const uri = photo.thumbnailUri || photo.uri;
      if (uri) {
        Image.prefetch(uri).catch(() => {});
      }
    });
  }, [isHydrated, photos]);

  const enqueueRepair = useCallback((photo: Photo) => {
    if (!repairQueueRef.current.find((p) => p.id === photo.id)) {
      repairQueueRef.current.push(photo);
    }
    processRepairQueue();
  }, [updatePhoto]);

  const processRepairQueue = useCallback(async () => {
    if (repairingRef.current || repairQueueRef.current.length === 0) return;
    repairingRef.current = true;

    while (repairQueueRef.current.length > 0) {
      const batch = repairQueueRef.current.splice(0, REPAIR_BATCH);

      await Promise.all(
        batch.map(async (photo) => {
          try {
            const newThumbnailUri = await generateThumbnail(photo.uri, 256, 256, 70);
            updatePhoto(photo.id, { thumbnailUri: newThumbnailUri });
          } catch {}
        }),
      );

      if (repairQueueRef.current.length > 0) {
        await new Promise((r) => setTimeout(r, REPAIR_DELAY));
      }
    }

    repairingRef.current = false;
  }, [updatePhoto]);

  return { enqueueRepair };
}
