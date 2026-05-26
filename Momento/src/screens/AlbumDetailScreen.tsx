import React, { useMemo, useCallback, useState } from 'react';
import { View, StyleSheet, Dimensions, Pressable, Text, Modal } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMd3Theme } from '../theme';
import { useAlbumStore, usePhotoStore } from '../store';
import { usePhotoImport } from '../hooks/usePhotoImport';
import type { RootStackScreenProps } from '../navigation/types';
import { Toolbar } from '../components/shared/Toolbar';
import { PhotoCard } from '../components/photo/PhotoCard';
import { EmptyState } from '../components/shared/EmptyState';
import { PhotoPickerDialog } from '../components/albums/PhotoPickerDialog';
import { ImportProgressModal } from '../components/overlays/ImportProgressModal';
import { LineIcon } from '../components/shared/LineIcon';
import type { Photo } from '../types';
import { useIncrementalList } from '../hooks/useIncrementalList';

function AddPhotoMenu({
  visible,
  onClose,
  onPickFromAlbum,
  onImportFromDevice,
  theme,
}: {
  visible: boolean;
  onClose: () => void;
  onPickFromAlbum: () => void;
  onImportFromDevice: () => void;
  theme: ReturnType<typeof useMd3Theme>;
}) {
  if (!visible) return null;

  return (
    <Modal transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.menuOverlay} onPress={onClose}>
        <Pressable
          style={[styles.menuCard, { backgroundColor: theme.colors.surfaceContainerLowest }]}
          onPress={(e) => e.stopPropagation()}
        >
          <Text style={[styles.menuTitle, { color: theme.colors.onSurface }]}>添加照片</Text>

          <Pressable
            style={[styles.menuItem, { backgroundColor: theme.colors.surfaceVariant }]}
            onPress={() => { onClose(); onPickFromAlbum(); }}
            android_ripple={{ color: theme.colors.primary + '1A' }}
          >
            <View style={[styles.menuIconCircle, { backgroundColor: theme.colors.primaryContainer }]}>
              <LineIcon name="image" size={20} color={theme.colors.onPrimaryContainer} />
            </View>
            <View style={styles.menuItemText}>
              <Text style={[styles.menuItemTitle, { color: theme.colors.onSurface }]}>从相册内导入</Text>
              <Text style={[styles.menuItemDesc, { color: theme.colors.onSurfaceVariant }]}>从已有照片中选择添加</Text>
            </View>
            <LineIcon name="chevron-right" size={18} color={theme.colors.outline} />
          </Pressable>

          <View style={{ height: 8 }} />

          <Pressable
            style={[styles.menuItem, { backgroundColor: theme.colors.surfaceVariant }]}
            onPress={() => { onClose(); onImportFromDevice(); }}
            android_ripple={{ color: theme.colors.primary + '1A' }}
          >
            <View style={[styles.menuIconCircle, { backgroundColor: theme.colors.secondaryContainer }]}>
              <LineIcon name="smartphone" size={20} color={theme.colors.onSecondaryContainer} />
            </View>
            <View style={styles.menuItemText}>
              <Text style={[styles.menuItemTitle, { color: theme.colors.onSurface }]}>从设备导入</Text>
              <Text style={[styles.menuItemDesc, { color: theme.colors.onSurfaceVariant }]}>从系统相册导入新照片</Text>
            </View>
            <LineIcon name="chevron-right" size={18} color={theme.colors.outline} />
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export function AlbumDetailScreen({ route, navigation }: RootStackScreenProps<'AlbumDetail'>) {
  const { albumId } = route.params;
  const theme = useMd3Theme();
  const insets = useSafeAreaInsets();
  const album = useAlbumStore((s) => s.albums.find((a) => a.id === albumId));
  const photos = usePhotoStore((s) => s.photos);
  const photoMap = usePhotoStore((s) => s.photoMap);
  const addToAlbum = useAlbumStore((s) => s.addToAlbum);
  const { isImporting, progress, importFromGallery, cancelImport } = usePhotoImport();
  const [pickerVisible, setPickerVisible] = useState(false);
  const [addMenuVisible, setAddMenuVisible] = useState(false);
  const prevPhotoCountRef = React.useRef(photos.length);

  const screenWidth = Dimensions.get('window').width;
  const cols = 3;
  const gap = 2;
  const cardSize = Math.floor((screenWidth - gap * 2 - gap * (cols - 1)) / cols);

  const albumPhotos = useMemo(() => {
    if (!album) return [];
    return album.photoIds
      .map((id) => photoMap.get(id))
      .filter(Boolean) as Photo[];
  }, [album, photoMap]);

  const handlePress = useCallback(
    (photoId: string) => {
      navigation.navigate('Lightbox', {
        photoId,
        photoIds: albumPhotos.map((p) => p.id),
      });
    },
    [albumPhotos, navigation],
  );

  const handlePickFromAlbum = useCallback(() => {
    setPickerVisible(true);
  }, []);

  const handleImportFromDevice = useCallback(() => {
    prevPhotoCountRef.current = photos.length;
    importFromGallery();
  }, [importFromGallery, photos.length]);

  React.useEffect(() => {
    if (!isImporting && photos.length > prevPhotoCountRef.current) {
      const newPhotoIds = photos
        .slice(prevPhotoCountRef.current)
        .map((p) => p.id);
      if (newPhotoIds.length > 0) {
        addToAlbum(albumId, newPhotoIds);
      }
      prevPhotoCountRef.current = photos.length;
    }
  }, [isImporting, photos.length, addToAlbum, albumId]);

  const rows = useMemo(() => {
    const result: Photo[][] = [];
    for (let i = 0; i < albumPhotos.length; i += cols) {
      result.push(albumPhotos.slice(i, i + cols));
    }
    return result;
  }, [albumPhotos]);
  const { visibleItems: visibleRows, loadMore } = useIncrementalList(rows);

  if (!album) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Toolbar title="相册" showBack onBack={() => navigation.goBack()} />
        <EmptyState title="相册不存在" />
      </View>
    );
  }


  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Toolbar
        title={album.name}
        subtitle={`${album.photoCount} 张${album.isSmart ? ' · 智能相册' : ''}`}
        showBack
        onBack={() => navigation.goBack()}
        actions={
          <Pressable style={styles.actionBtn} onPress={() => setAddMenuVisible(true)}>
            <LineIcon name="plus" size={22} color={theme.colors.primary} />
          </Pressable>
        }
      />
      {albumPhotos.length === 0 ? (
        <EmptyState icon="image" title="相册为空" subtitle="点击 + 添加照片到相册" />
      ) : (
        <FlashList
          data={visibleRows}
          keyExtractor={(_, idx) => `ad-${idx}`}
          estimatedItemSize={120}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onEndReached={loadMore}
          onEndReachedThreshold={0.6}
          renderItem={({ item: row }) => (
            <View style={[styles.row, { gap }]}>
              {row.map((p) => (
                <PhotoCard key={p.id} photo={p} size={cardSize} onPress={handlePress} />
              ))}
            </View>
          )}
        />
      )}
      <AddPhotoMenu
        visible={addMenuVisible}
        onClose={() => setAddMenuVisible(false)}
        onPickFromAlbum={handlePickFromAlbum}
        onImportFromDevice={handleImportFromDevice}
        theme={theme}
      />
      <PhotoPickerDialog
        visible={pickerVisible}
        albumId={albumId}
        onClose={() => setPickerVisible(false)}
      />
      <ImportProgressModal
        visible={isImporting}
        progress={progress}
        onComplete={cancelImport}
        onCancel={cancelImport}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: { paddingHorizontal: 2, paddingBottom: 80 },
  row: { flexDirection: 'row', marginBottom: 2 },
  actionBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuCard: {
    width: '85%',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 16,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    padding: 14,
    gap: 12,
  },
  menuIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemText: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  menuItemDesc: {
    fontSize: 12,
    marginTop: 2,
  },
});
