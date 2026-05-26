import { useEffect, useState } from 'react';
import { usePhotoStore, useSettingsStore } from '../store';
import { generateMockPhotos } from '../utils/mockData';
import { logError } from '../utils/logger';

export function useAppInit(): boolean {
  const loadSettings = useSettingsStore((s) => s.loadSettings);
  const isHydrated = useSettingsStore((s) => s.isHydrated);
  const setPhotos = usePhotoStore((s) => s.setPhotos);
  const hydrateFromDb = usePhotoStore((s) => s.hydrateFromDb);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        await loadSettings();
      } catch (err) {
        logError('useAppInit.loadSettings', err);
        useSettingsStore.setState({ isHydrated: true });
      }

      if (cancelled) return;

      try {
        await hydrateFromDb();
      } catch (err) {
        logError('useAppInit.hydrateFromDb', err);
        usePhotoStore.setState({ isHydrated: true, isGridReady: true });
      }

      if (cancelled) return;

      usePhotoStore.setState({ isHydrated: true, isGridReady: true });

      const currentPhotos = usePhotoStore.getState().photos;
      if (currentPhotos.length === 0) {
        setPhotos(generateMockPhotos());
      }

      setReady(true);
    }

    init();

    return () => {
      cancelled = true;
    };
  }, [hydrateFromDb, loadSettings, setPhotos]);

  return ready && isHydrated;
}
