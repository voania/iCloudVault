import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Modal } from 'react-native';
import { useMd3Theme } from '../../theme';
import { useAlbumStore } from '../../store';
import type { Album } from '../../types';

// ============================================================
// AlbumChipMenu — 底部弹出的相册选择菜单
// 用于将照片添加到一个或多个相册
// ============================================================

interface AlbumChipMenuProps {
  visible: boolean;
  photoId?: string;
  photoIds?: string[];
  onClose: () => void;
  onDone: () => void;
}

export function AlbumChipMenu({ visible, photoId, photoIds, onClose, onDone }: AlbumChipMenuProps) {
  const theme = useMd3Theme();
  const albums = useAlbumStore((s) => s.albums);
  const addToAlbum = useAlbumStore((s) => s.addToAlbum);
  const removeFromAlbum = useAlbumStore((s) => s.removeFromAlbum);
  const getAlbumsByPhotoId = useAlbumStore((s) => s.getAlbumsByPhotoId);

  const allIds = photoIds || (photoId ? [photoId] : []);
  const photoAlbums = photoId ? getAlbumsByPhotoId(photoId) : [];

  const handleToggle = (album: Album) => {
    if (photoAlbums.some((a) => a.id === album.id)) {
      removeFromAlbum(album.id, allIds);
    } else {
      addToAlbum(album.id, allIds);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={[styles.sheet, { backgroundColor: theme.colors.surface }]}>
          {/* 手柄 */}
          <View style={[styles.handle, { backgroundColor: theme.colors.outlineVariant }]} />

          <Text style={[styles.title, { color: theme.colors.onSurface }]}>
            {allIds.length > 1 ? `添加 ${allIds.length} 张照片到相册` : '添加到相册'}
          </Text>

          {albums.length === 0 ? (
            <Text style={[styles.empty, { color: theme.colors.onSurfaceVariant }]}>
              还没有相册，请先创建相册
            </Text>
          ) : (
            <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
              {albums.map((album) => {
                const isAdded = photoAlbums.some((a) => a.id === album.id);
                return (
                  <Pressable
                    key={album.id}
                    style={[styles.item, { borderBottomColor: theme.colors.outlineVariant }]}
                    onPress={() => handleToggle(album)}
                  >
                    <View
                      style={[
                        styles.checkbox,
                        {
                          backgroundColor: isAdded ? theme.colors.primary : theme.colors.surfaceVariant,
                          borderColor: isAdded ? theme.colors.primary : theme.colors.outline,
                        },
                      ]}
                    >
                      {isAdded && <Text style={styles.checkmark}>✓</Text>}
                    </View>
                    <View style={styles.itemInfo}>
                      <Text style={[styles.itemName, { color: theme.colors.onSurface }]}>
                        {album.name}
                      </Text>
                      <Text style={[styles.itemMeta, { color: theme.colors.onSurfaceVariant }]}>
                        {album.photoCount} 张{album.isSmart ? ' · 智能' : ''}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </ScrollView>
          )}

          <Pressable
            style={[styles.doneBtn, { backgroundColor: theme.colors.primary }]}
            onPress={() => {
              onDone();
              onClose();
            }}
          >
            <Text style={[styles.doneText, { color: theme.colors.onPrimary }]}>完成</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#00000066',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 36,
    maxHeight: '60%',
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 16 },
  empty: { fontSize: 14, textAlign: 'center', paddingVertical: 24 },
  list: { maxHeight: 280 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkmark: { color: '#fff', fontSize: 14, fontWeight: '700' },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 15, fontWeight: '500' },
  itemMeta: { fontSize: 12, marginTop: 2 },
  doneBtn: {
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  doneText: { fontSize: 16, fontWeight: '600' },
});
