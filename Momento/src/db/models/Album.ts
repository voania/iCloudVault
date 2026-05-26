// ============================================================
// WatermelonDB Album Model
// ============================================================

import type { Album as IAlbum, SmartAlbumRule } from '../../types';

export interface AlbumRecord {
  id: string;
  name: string;
  description: string;
  coverUri: string | null;
  photoCount: number;
  isSmart: boolean;
  createdAt: number;
  sortOrder: number;
}

export interface AlbumPhotoRecord {
  albumId: string;
  photoId: string;
  addedAt: number;
}

export interface SmartAlbumRuleRecord {
  albumId: string;
  field: string;
  operator: string;
  value: string;
}

export function albumToRecord(album: IAlbum): AlbumRecord {
  return {
    id: album.id,
    name: album.name,
    description: album.description,
    coverUri: album.coverUri ?? null,
    photoCount: album.photoCount,
    isSmart: album.isSmart,
    createdAt: album.createdAt,
    sortOrder: album.sortOrder,
  };
}

export function recordToAlbum(rec: AlbumRecord, photoIds: string[], rules?: SmartAlbumRule[]): IAlbum {
  return {
    ...rec,
    coverUri: rec.coverUri ?? undefined,
    photoIds,
    smartRules: rules,
  };
}

export function rulesToRecords(albumId: string, rules: SmartAlbumRule[]): SmartAlbumRuleRecord[] {
  return rules.map((r) => ({
    albumId,
    field: r.field,
    operator: r.operator,
    value: JSON.stringify(r.value),
  }));
}

export function recordsToRules(records: SmartAlbumRuleRecord[]): SmartAlbumRule[] {
  return records.map((r) => ({
    field: r.field as SmartAlbumRule['field'],
    operator: r.operator as SmartAlbumRule['operator'],
    value: JSON.parse(r.value),
  }));
}
