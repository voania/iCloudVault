import type { ExifData } from '../../types';

export interface PickedImage {
  uri: string;
  filename: string;
  width: number;
  height: number;
  sizeBytes: number;
  type: string;
  duration?: number;
  exif?: Record<string, unknown>;
  latitude?: number;
  longitude?: number;
  timestamp?: number;
  albumName?: string;
}

export interface IPhotoPicker {
  pickFromGallery(options?: PickerOptions): Promise<PickedImage[]>;
  pickFromCamera(options?: PickerOptions): Promise<PickedImage[]>;
  getAlbums?(): Promise<AlbumInfo[]>;
  pickFromAlbum?(albumId: string, options?: PickerOptions): Promise<PickedImage[]>;
}

export interface AlbumInfo {
  id: string;
  name: string;
  count: number;
  thumbnailUri?: string;
}

export interface PickerOptions {
  multiple?: boolean;
  mediaType?: 'photo' | 'video' | 'mixed';
  quality?: number;
  maxFiles?: number;
  includeLivePhotos?: boolean;
}

export interface IThumbnailGenerator {
  generate(uri: string, maxWidth: number, maxHeight: number, quality?: number): Promise<string>;
}

export interface IExifParser {
  parse(uri: string, rawExif?: Record<string, unknown>): Promise<ExifData>;
}

export interface IColorExtractor {
  extract(uri: string): Promise<string>;
}

export interface ImportProgress {
  current: number;
  total: number;
  currentFile: string;
  phase: 'picking' | 'processing' | 'complete';
  successCount: number;
  failedCount: number;
}

export type ImportProgressCallback = (progress: ImportProgress) => void;

export interface ImportOptions {
  quality?: number;
  skipDuplicates?: boolean;
  parallelProcessing?: boolean;
  maxParallel?: number;
  yieldBetweenBatches?: boolean;
}
