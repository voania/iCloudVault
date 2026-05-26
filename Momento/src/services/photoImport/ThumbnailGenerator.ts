import { NativeModules, Platform } from 'react-native';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import type { IThumbnailGenerator } from './types';

const { PaletteModule } = NativeModules;

let persistentDir: string | null = null;

async function getPersistentDir(): Promise<string> {
  if (persistentDir) return persistentDir;

  if (Platform.OS === 'android' && PaletteModule?.getFilesDir) {
    try {
      const filesDir = await PaletteModule.getFilesDir();
      persistentDir = `${filesDir}/thumbnails`;
      return persistentDir;
    } catch {}
  }

  return '';
}

function hashFilename(uri: string): string {
  let hash = 0;
  const str = uri.replace(/^file:\/\//, '');
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return Math.abs(hash).toString(36);
}

export class ThumbnailGenerator implements IThumbnailGenerator {
  async generate(
    uri: string,
    maxWidth: number = 256,
    maxHeight: number = 256,
    quality: number = 70,
  ): Promise<string> {
    try {
      const dir = await getPersistentDir();

      if (dir) {
        const filename = `thumb_${hashFilename(uri)}_${maxWidth}x${maxWidth}_q${quality}.jpg`;
        const outputPath = `${dir}/${filename}`;

        const result = await ImageResizer.createResizedImage(
          uri,
          maxWidth,
          maxHeight,
          'JPEG',
          quality,
          0,
          outputPath,
          false,
          { mode: 'cover', onlyScaleDown: true },
        );
        return result.uri;
      }

      const result = await ImageResizer.createResizedImage(
        uri,
        maxWidth,
        maxHeight,
        'JPEG',
        quality,
        0,
        undefined,
        false,
        { mode: 'cover', onlyScaleDown: true },
      );
      return result.uri;
    } catch {
      return uri;
    }
  }
}
