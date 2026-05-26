import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  Dimensions,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMd3Theme } from '../../theme';
import { usePhotoStore, useAlbumStore, useUiStore } from '../../store';
import { PhotoCard } from '../photo/PhotoCard';
import { LineIcon } from '../shared/LineIcon';
import type { Photo } from '../../types';

interface PhotoPickerDialogProps {
  visible: boolean;
  albumId: string;
  onClose: () => void;
}

export function PhotoPickerDialog({ visible, albumId, onClose }: PhotoPickerDialogProps) {
  const insets = useSafeAreaInsets();
  const theme = useMd3Theme();
  const photos = usePhotoStore((s) => s.photos.filter((p) => !p.isDeleted));
  const addToAlbum = useAlbumStore((s) => s.addToAlbum);
  const showToast = useUiStore((s) => s.showToast);
  const screenWidth = Dimensions.get('window').width;
  const cardSize = Math.floor((screenWidth - 48) / 3);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggle = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const selectAll = useCallback(() => {
    if (selectedIds.size === photos.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(photos.map((p) => p.id)));
    }
  }, [selectedIds.size, photos]);

  const handleAdd = () => {
    if (selectedIds.size === 0) return;
    addToAlbum(albumId, [...selectedIds]);
    showToast(`已添加 ${selectedIds.size} 张照片`, 'success');
    setSelectedIds(new Set());
    onClose();
  };

  const handleClose = () => {
    setSelectedIds(new Set());
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={[styles.header, { paddingTop: insets.top + 12, borderBottomColor: theme.colors.outlineVariant }]}>
          <Pressable onPress={handleClose}>
            <Text style={[styles.headerBtn, { color: theme.colors.primary }]}>取消</Text>
          </Pressable>
          <Text style={[styles.title, { color: theme.colors.onSurface }]}>
            选择照片 ({selectedIds.size})
          </Text>
          <Pressable onPress={handleAdd}>
            <Text
              style={[
                styles.headerBtn,
                { color: selectedIds.size > 0 ? theme.colors.primary : theme.colors.outline },
              ]}
            >
              添加{selectedIds.size > 0 ? ` ${selectedIds.size}` : ''}
            </Text>
          </Pressable>
        </View>

        <View style={[styles.toolbar, { borderBottomColor: theme.colors.outlineVariant }]}>
          <Text style={[styles.hint, { color: theme.colors.onSurfaceVariant }]}>
            点击照片选择，可多选
          </Text>
          <Pressable
            style={[styles.selectAllBtn, { backgroundColor: theme.colors.secondaryContainer }]}
            onPress={selectAll}
          >
            <LineIcon name="check-double" size={14} color={theme.colors.onSecondaryContainer} />
            <Text style={[styles.selectAllText, { color: theme.colors.onSecondaryContainer }]}>
              {selectedIds.size === photos.length ? '取消全选' : '全选'}
            </Text>
          </Pressable>
        </View>

        <FlashList
          data={photos}
          numColumns={3}
          keyExtractor={(item) => item.id}
          estimatedItemSize={120}
          contentContainerStyle={styles.grid}
          renderItem={({ item }: { item: Photo }) => (
            <PhotoCard
              photo={item}
              size={cardSize}
              selected={selectedIds.has(item.id)}
              selectMode
              onPress={toggle}
            />
          )}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 0.5,
  },
  headerBtn: { fontSize: 15, fontWeight: '500' },
  title: { fontSize: 16, fontWeight: '700' },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 0.5,
  },
  hint: {
    fontSize: 13,
  },
  selectAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  selectAllText: {
    fontSize: 13,
    fontWeight: '500',
  },
  grid: { padding: 8, paddingBottom: 80 },
});
