import { NativeModules, Platform } from 'react-native';
import type { IColorExtractor } from './types';
import { FallbackColorExtractor } from './FallbackColorExtractor';

const { PaletteModule } = NativeModules;

export class PaletteColorExtractor implements IColorExtractor {
  private fallback = new FallbackColorExtractor();

  async extract(uri: string): Promise<string> {
    if (Platform.OS !== 'android' || !PaletteModule?.getDominantColor) {
      return this.fallback.extract(uri);
    }

    try {
      const color = await PaletteModule.getDominantColor(uri);
      return color || this.fallback.extract(uri);
    } catch {
      return this.fallback.extract(uri);
    }
  }
}
