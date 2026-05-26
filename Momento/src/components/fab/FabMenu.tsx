import React, { useMemo, useEffect, useRef, useState } from 'react';
import { StyleSheet, Pressable, Text, Animated, View, Image } from 'react-native';
import { useAppTheme, type AppMD3Theme, type AppTokens } from '../../theme';
import { usePhotoStore, useUiStore } from '../../store';
import { usePhotoImport } from '../../hooks/usePhotoImport';
import { ImportProgressModal } from '../overlays/ImportProgressModal';
import { LineIcon } from '../shared/LineIcon';
import type { TabScreenProps } from '../../navigation/types';
import type { AlbumInfo } from '../../services/photoImport';

interface FabAction {
  id: string;
  iconName: string;
  label: string;
  onPress: () => void;
}

const FAB_SIZE = 56;
const FAB_RIGHT = 20;
const FAB_BOTTOM = 120;
const ITEM_SIZE = 44;
const ITEM_GAP = 10;

function FabMenuItem({ action, index, isOpen, theme, tokens }: {
  action: FabAction;
  index: number;
  isOpen: boolean;
  theme: AppMD3Theme;
  tokens: AppTokens;
}) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isOpen) {
      Animated.spring(anim, {
        toValue: 1,
        friction: 7,
        tension: 40,
        delay: index * 30,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(anim, {
        toValue: 0,
        duration: 120,
        delay: index * 15,
        useNativeDriver: true,
      }).start();
    }
  }, [isOpen, index]);

  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [12, 0] });
  const scale = anim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] });
  const opacity = anim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });

  return (
    <Animated.View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 5,
        marginBottom: ITEM_GAP,
        transform: [{ translateY }, { scale }],
        opacity,
      }}
    >
      <View style={[styles.labelPill, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.labelText, { color: theme.colors.onSurface }]}>{action.label}</Text>
      </View>
      <Pressable
        style={[styles.itemCircle, { backgroundColor: theme.colors.secondaryContainer }]}
        onPress={action.onPress}
        android_ripple={{ color: tokens.ripple, borderless: true }}
      >
        <LineIcon name={action.iconName} size={20} color={theme.colors.onSecondaryContainer} />
      </Pressable>
    </Animated.View>
  );
}

export function FabMenu({ navigation }: { navigation: TabScreenProps<'PhotosTab'>['navigation'] | TabScreenProps<'MapJourneysTab'>['navigation'] }) {
  const { md3Theme: theme, tokens } = useAppTheme();
  const isFabOpen = useUiStore((s) => s.isFabOpen);
  const toggleFab = useUiStore((s) => s.toggleFab);

  const { isImporting, progress, albums, importFromGallery, importFromCamera, importFromAlbum, loadAlbums, cancelImport } = usePhotoImport();
  
  const [showAlbumPicker, setShowAlbumPicker] = useState(false);
  const [albumsLoaded, setAlbumsLoaded] = useState(false);

  const shapeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(shapeAnim, {
      toValue: isFabOpen ? 1 : 0,
      friction: 7,
      tension: 50,
      useNativeDriver: true,
    }).start();
  }, [isFabOpen]);

  useEffect(() => {
    if (showAlbumPicker && !albumsLoaded) {
      loadAlbums();
      setAlbumsLoaded(true);
    }
  }, [showAlbumPicker, albumsLoaded, loadAlbums]);

  const borderRadius = 999;

  const rotate = shapeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  const bgColor = isFabOpen ? theme.colors.error : theme.colors.primary;

  const handleSelectFromAlbum = async (albumId: string) => {
    setShowAlbumPicker(false);
    toggleFab(false);
    await importFromAlbum(albumId);
  };

  const handleImportAllFromAlbum = async (albumId: string) => {
    setShowAlbumPicker(false);
    toggleFab(false);
    await importFromAlbum(albumId);
  };
  const actions: FabAction[] = useMemo(
    () => [
      {
        id: 'import-gallery',
        iconName: 'image',
        label: '从相册导入',
        onPress: () => { toggleFab(false); importFromGallery(); },
      },
      {
        id: 'import-camera',
        iconName: 'camera',
        label: '拍照导入',
        onPress: () => { toggleFab(false); importFromCamera(); },
      },
      {
        id: 'import-album',
        iconName: 'folder-open',
        label: '从相册目录导入',
        onPress: () => setShowAlbumPicker(true),
      },
      {
        id: 'ai',
        iconName: 'robot',
        label: 'AI 分析',
        onPress: () => { toggleFab(false); useUiStore.getState().setAiOverlayVisible(true); },
      },
      {
        id: 'collage',
        iconName: 'palette',
        label: '拼图',
        onPress: () => {
          toggleFab(false);
          const ids = usePhotoStore.getState().photos.filter((p) => !p.isDeleted).slice(0, 9).map((p) => p.id);
          if (ids.length >= 2) navigation.navigate('Collage', { photoIds: ids });
        },
      },
      {
        id: 'slideshow',
        iconName: 'play',
        label: '幻灯片',
        onPress: () => {
          toggleFab(false);
          const ids = usePhotoStore.getState().photos.filter((p) => !p.isDeleted).map((p) => p.id);
          if (ids.length > 0) navigation.navigate('Slideshow', { photoIds: ids });
        },
      },
      {
        id: 'dedup',
        iconName: 'scan',
        label: '去重扫描',
        onPress: () => { toggleFab(false); useUiStore.getState().setDedupOverlayVisible(true); },
      },
      {
        id: 'storage',
        iconName: 'box',
        label: '存储管理',
        onPress: () => { toggleFab(false); navigation.navigate('StorageDashboard'); },
      },
    ],
    [navigation, toggleFab, importFromGallery, importFromCamera, importFromAlbum],
  );

  return (
    <View
      collapsable={false}
      pointerEvents="box-none"
      style={styles.wrapper}
    >
      {showAlbumPicker && (
        <Pressable
          style={StyleSheet.absoluteFillObject}
          onPress={() => setShowAlbumPicker(false)}
        />
      )}

      {isFabOpen && !showAlbumPicker && (
        <Pressable
          style={StyleSheet.absoluteFillObject}
          onPress={() => toggleFab(false)}
        />
      )}

      {showAlbumPicker && (
        <View style={[styles.albumPicker, { backgroundColor: theme.colors.surfaceVariant }]}>
          <View style={styles.albumPickerHeader}>
            <Text style={[styles.albumPickerTitle, { color: theme.colors.onSurface }]}>选择相册</Text>
            <Pressable onPress={() => setShowAlbumPicker(false)}>
              <Text style={[styles.albumPickerClose, { color: theme.colors.onSurfaceVariant }]}>✕</Text>
            </Pressable>
          </View>
          <View style={styles.albumList}>
            {albums.length > 0 ? (
              albums.map((album: AlbumInfo) => (
                <View key={album.id} style={styles.albumItemContainer}>
                  <Pressable
                    style={styles.albumItem}
                    onPress={() => handleSelectFromAlbum(album.id)}
                  >
                    {album.thumbnailUri ? (
                      <Image
                        source={{ uri: album.thumbnailUri }}
                        style={styles.albumThumbnail}
                      />
                    ) : (
                      <View style={[styles.albumThumbnail, { backgroundColor: theme.colors.outlineVariant }]}>
                        <LineIcon name="folder" size={24} color={theme.colors.onSurfaceVariant} />
                      </View>
                    )}
                    <View style={styles.albumInfo}>
                      <Text style={[styles.albumName, { color: theme.colors.onSurface }]}>{album.name}</Text>
                      <Text style={[styles.albumCount, { color: theme.colors.onSurfaceVariant }]}>
                        {album.count} 张照片
                      </Text>
                    </View>
                  </Pressable>
                  <View style={styles.albumActions}>
                    <Pressable
                      style={[styles.actionBtn, { backgroundColor: theme.colors.primaryContainer }]}
                      onPress={() => handleSelectFromAlbum(album.id)}
                    >
                      <Text style={[styles.actionBtnText, { color: theme.colors.onPrimaryContainer }]}>选择</Text>
                    </Pressable>
                    <Pressable
                      style={[styles.actionBtn, styles.actionBtnSecondary, { backgroundColor: theme.colors.secondaryContainer }]}
                      onPress={() => handleImportAllFromAlbum(album.id)}
                    >
                      <Text style={[styles.actionBtnText, { color: theme.colors.onSecondaryContainer }]}>全部</Text>
                    </Pressable>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
                  无法获取相册列表
                </Text>
              </View>
            )}
          </View>
        </View>
      )}

      {isFabOpen && !showAlbumPicker && (
        <View style={styles.menuArea} pointerEvents="auto">
          {actions.map((action, index) => (
            <FabMenuItem
              key={action.id}
              action={action}
              index={index}
              isOpen={isFabOpen}
              theme={theme}
              tokens={tokens}
            />
          ))}
        </View>
      )}

      <Pressable
        onPress={() => toggleFab()}
        android_ripple={{ color: tokens.ripple, borderless: true }}
      >
        <Animated.View style={[styles.fab, { backgroundColor: bgColor, borderRadius, transform: [{ rotate }], shadowColor: theme.colors.primary }]}>
          <LineIcon name="plus" size={28} color={theme.colors.onPrimary} />
        </Animated.View>
      </Pressable>

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
  wrapper: {
    position: 'absolute',
    bottom: FAB_BOTTOM,
    right: FAB_RIGHT,
    alignItems: 'flex-end',
    zIndex: 40,
    backgroundColor: 'transparent',
  },
  menuArea: {
    marginBottom: 14,
    alignItems: 'flex-end',
    backgroundColor: 'transparent',
  },
  labelPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  labelText: {
    fontSize: 13,
    fontWeight: '500',
  },
  itemCircle: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderRadius: ITEM_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  fab: {
    width: FAB_SIZE,
    height: FAB_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  albumPicker: {
    position: 'absolute',
    bottom: FAB_SIZE + 20,
    right: 0,
    width: 280,
    maxHeight: 400,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
  },
  albumPickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  albumPickerTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  albumPickerClose: {
    fontSize: 18,
    padding: 4,
  },
  albumList: {
    maxHeight: 320,
    overflowY: 'auto',
  },
  albumItem: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 8,
  },
  albumThumbnail: {
    width: 48,
    height: 48,
    borderRadius: 8,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  albumInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  albumName: {
    fontSize: 14,
    fontWeight: '500',
  },
  albumCount: {
    fontSize: 12,
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
  },
  albumItemContainer: {
    marginBottom: 8,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  albumActions: {
    flexDirection: 'row',
    gap: 8,
    padding: 8,
    paddingTop: 0,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionBtnSecondary: {
    flex: 0.8,
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '500',
  },
});
