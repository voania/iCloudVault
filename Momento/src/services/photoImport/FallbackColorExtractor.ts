import type { IColorExtractor } from './types';

const PALETTE = [
  '#6750A4', '#E91E63', '#4CAF50', '#2196F3', '#FF9800',
  '#9C27B0', '#009688', '#FF5722', '#607D8B', '#795548',
  '#3F51B5', '#CDDC39', '#FFC107', '#00BCD4', '#F44336',
];

function hashString(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) & 0x7fffffff;
  }
  return hash;
}

export class FallbackColorExtractor implements IColorExtractor {
  async extract(uri: string): Promise<string> {
    const index = hashString(uri) % PALETTE.length;
    return PALETTE[index];
  }
}
