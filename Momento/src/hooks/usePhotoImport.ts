import { useState, useRef, useCallback } from 'react';
import { usePhotoStore, useSettingsStore, useUiStore } from '../store';
import {
  createPhotoImportService,
  PhotoImportService,
  type ImportProgress,
  type PickedImage,
  type AlbumInfo,
  type ImportOptions,
} from '../services/photoImport';

export type ImportSource = 'gallery' | 'camera' | 'album';

export interface UsePhotoImportReturn {
  isImporting: boolean;
  progress: ImportProgress | null;
  albums: AlbumInfo[];
  importFromGallery: () => Promise<void>;
  importFromCamera: () => Promise<void>;
  importFromAlbum: (albumId: string) => Promise<void>;
  loadAlbums: () => Promise<void>;
  cancelImport: () => void;
}

export function usePhotoImport(): UsePhotoImportReturn {
  const addPhotos = usePhotoStore((s) => s.addPhotos);
  const showToast = useUiStore((s) => s.showToast);
  const setLastImportTimestamp = useSettingsStore((s) => s.setLastImportTimestamp);

  const [isImporting, setIsImporting] = useState(false);
  const [progress, setProgress] = useState<ImportProgress | null>(null);
  const [albums, setAlbums] = useState<AlbumInfo[]>([]);
  const serviceRef = useRef<PhotoImportService>(createPhotoImportService());

  const doImport = useCallback(
    async (source: ImportSource, albumId?: string) => {
      setIsImporting(true);
      setProgress({ 
        current: 0, 
        total: 0, 
        currentFile: '', 
        phase: 'picking',
        successCount: 0,
        failedCount: 0,
      });

      const service = serviceRef.current;
      service.reset();

      let images: PickedImage[];
      try {
        if (source === 'gallery') {
          images = await service.pickFromGallery({ multiple: true, maxFiles: 50, mediaType: 'mixed' });
        } else if (source === 'camera') {
          images = await service.pickFromCamera();
        } else if (source === 'album' && albumId) {
          images = await service.pickFromAlbum(albumId, { multiple: true, maxFiles: 100, mediaType: 'mixed' });
        } else {
          images = [];
        }
      } catch (err) {
        console.warn('Photo picking error:', err);
        setIsImporting(false);
        setProgress(null);
        showToast('无法打开照片选择器', 'error');
        return;
      }

      if (images.length === 0) {
        setIsImporting(false);
        setProgress(null);
        return;
      }

      try {
        const importOptions: ImportOptions = {
          parallelProcessing: true,
          maxParallel: 3,
          yieldBetweenBatches: true,
        };

        const photos = await service.importPhotos(images, (p) => {
          setProgress(p);
        }, importOptions);

        if (photos.length > 0) {
          addPhotos(photos);
          setLastImportTimestamp(Date.now());
          const failedCount = progress?.failedCount ?? 0;
          if (failedCount > 0) {
            showToast(`成功导入 ${photos.length} 张照片，${failedCount} 张失败`, 'success');
          } else {
            showToast(`成功导入 ${photos.length} 张照片`, 'success');
          }
        } else if (!service.cancelled) {
          showToast('导入失败，请重试', 'warning');
        }
      } catch (err) {
        console.warn('Photo import error:', err);
        showToast('导入过程中出错', 'error');
      } finally {
        setIsImporting(false);
        setProgress(null);
      }
    },
    [addPhotos, showToast, setLastImportTimestamp],
  );

  const importFromGallery = useCallback(() => doImport('gallery'), [doImport]);
  const importFromCamera = useCallback(() => doImport('camera'), [doImport]);
  const importFromAlbum = useCallback((albumId: string) => doImport('album', albumId), [doImport]);

  const loadAlbums = useCallback(async () => {
    try {
      const service = serviceRef.current;
      const albumsList = await service.getAlbums();
      setAlbums(albumsList);
    } catch (err) {
      console.warn('Failed to load albums:', err);
      setAlbums([]);
    }
  }, []);

  const cancelImport = useCallback(() => {
    serviceRef.current.cancel();
    setIsImporting(false);
    setProgress(null);
    showToast('已取消导入', 'info');
  }, [showToast]);

  return { 
    isImporting, 
    progress, 
    albums,
    importFromGallery, 
    importFromCamera, 
    importFromAlbum,
    loadAlbums,
    cancelImport 
  };
}
