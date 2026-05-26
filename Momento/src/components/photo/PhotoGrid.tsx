import React, { useMemo, useCallback, useState, useRef, useEffect } from 'react';
import {
  ActivityIndicator,
  View,
  useWindowDimensions,
  RefreshControl,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useSettingsStore } from '../../store';
import { useAppTheme } from '../../theme';
import { PhotoCard } from './PhotoCard';
import { useThumbnailPrefetch } from '../../utils/thumbnailCache';
import type { Photo } from '../../types';

interface PhotoGridProps {
  photos: Photo[];
  onPhotoPress: (photoId: string) => void;
  onPhotoLongPress?: (photoId: string) => void;
  selectedIds?: Set<string>;
  selectMode?: boolean;
  gap?: number;
  padding?: number;
  refreshing?: boolean;
  onRefresh?: () => void;
  ListHeaderComponent?: React.ReactElement | null;
  initialRenderCount?: number;
  pageSize?: number;
  style?: StyleProp<ViewStyle>;
}

export function PhotoGrid({
  photos,
  onPhotoPress,
  onPhotoLongPress,
  selectedIds,
  selectMode,
  gap = 6,
  padding = 0,
  refreshing = false,
  onRefresh,
  ListHeaderComponent,
  initialRenderCount = 120,
  pageSize = 90,
  style,
}: PhotoGridProps) {
  const { width: screenWidth } = useWindowDimensions();
  const gridColumns = useSettingsStore((s) => s.gridColumns);
  const { md3Theme: theme } = useAppTheme();
  const normalizedInitialCount = Math.max(initialRenderCount, gridColumns * 12);
  const normalizedPageSize = Math.max(pageSize, gridColumns * 8);
  const [renderedCount, setRenderedCount] = useState(normalizedInitialCount);

  // 状态追踪当前可视区域的开始和结束索引
  const [visibleRange, setVisibleRange] = useState<{ start: number; end: number } | undefined>(undefined);

  const cardSize = useMemo(() => {
    const totalGap = gap * (gridColumns - 1) + padding * 2;
    return Math.floor((screenWidth - totalGap) / gridColumns);
  }, [screenWidth, gridColumns, gap, padding]);

  useEffect(() => {
    setRenderedCount(normalizedInitialCount);
  }, [photos, normalizedInitialCount]);

  const visiblePhotos = useMemo(
    () => photos.slice(0, Math.min(renderedCount, photos.length)),
    [photos, renderedCount],
  );

  const hasMore = visiblePhotos.length < photos.length;

  const handleEndReached = useCallback(() => {
    if (!hasMore) {
      return;
    }
    setRenderedCount((count) => Math.min(count + normalizedPageSize, photos.length));
  }, [hasMore, normalizedPageSize, photos.length]);

  const renderItem = useCallback(({ item, index }: { item: Photo; index: number }) => (
    <View style={{ paddingBottom: gap }}>
      <PhotoCard
        photo={item}
        size={cardSize}
        index={index}
        selected={selectedIds?.has(item.id)}
        selectMode={selectMode}
        onPress={onPhotoPress}
        onLongPress={onPhotoLongPress}
      />
    </View>
  ), [cardSize, gap, selectedIds, selectMode, onPhotoPress, onPhotoLongPress]);

  const overrideItemLayout = useCallback(
    (layout: { span?: number; size?: number }, _item: Photo, _index: number) => {
      layout.size = cardSize + gap;
    },
    [cardSize, gap],
  );

  const keyExtractor = useCallback((item: Photo) => item.id, []);

  // 检测可视区域元素变化，用于缩略图预加载
  const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: Array<{ index: number | null }> }) => {
    if (viewableItems.length > 0) {
      let start = Infinity;
      let end = -Infinity;
      for (const item of viewableItems) {
        if (item.index !== null) {
          if (item.index < start) start = item.index;
          if (item.index > end) end = item.index;
        }
      }
      if (start !== Infinity && end !== -Infinity) {
        setVisibleRange({ start, end });
      }
    }
  }, []);

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 10, // 只要露出 10% 即判定可见，有助于尽早预加载
  }).current;

  // 使用高性能缩略图预加载 Hook
  useThumbnailPrefetch(visiblePhotos, visibleRange);

  const contentContainerStyle = useMemo(() => ({ padding }), [padding]);
  const selectionVersion = selectedIds ? Array.from(selectedIds).sort().join('|') : '';
  const extraData = useMemo(
    () => ({ cardSize, renderedCount, selectMode, selectionVersion }),
    [cardSize, renderedCount, selectMode, selectionVersion],
  );

  const ListFooterComponent = useMemo(
    () =>
      hasMore ? (
        <View style={{ paddingVertical: 20 }}>
          <ActivityIndicator size="small" color={theme.colors.primary} />
        </View>
      ) : null,
    [hasMore, theme.colors.primary],
  );

  return (
    <View style={style}>
      <FlashList
        data={visiblePhotos}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        numColumns={gridColumns}
        key={`grid-${gridColumns}`}
        estimatedItemSize={cardSize + gap}
        overrideItemLayout={overrideItemLayout}
        contentContainerStyle={contentContainerStyle}
        extraData={extraData}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        scrollEventThrottle={16}
        drawDistance={cardSize * gridColumns * 2}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.6}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={ListFooterComponent}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.colors.primary}
              colors={[theme.colors.primary, theme.colors.onSurfaceVariant, theme.colors.outline]}
            />
          ) : undefined
        }
      />
    </View>
  );
}
