import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  Image,
  Dimensions,
  ActivityIndicator,
  FlatList,
  InteractionManager,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  interpolate,
  interpolateColor,
  withTiming,
  runOnUI,
  runOnJS,
  useAnimatedReaction,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { usePhotos, usePhotoImport, useThumbnailPrefetch } from '../hooks';
import { usePhotoStore, useUiStore, useSettingsStore } from '../store';
import { useAppTheme } from '../theme';
import { LineIcon } from '../components/shared/LineIcon';
import { hapticMedium, hapticSelection, hapticSuccess, hapticWarning } from '../services/haptics';
import { VideoIndicator } from '../components/photo/VideoIndicator';
import { MasonryPhotoCell } from '../components/photo/MasonryPhotoCell';
import { useMasonryLayout, DATE_ITEM_HEIGHT } from '../hooks/useMasonryLayout';
import { useJustifiedLayout } from '../utils/justifiedLayout';
import type { MasonryLayoutItem } from '../utils/masonryLayout';
import type { DateRow, LayoutItem } from '../utils/justifiedLayout';
import type { TabScreenProps } from '../navigation/types';
import type { Photo } from '../types';

const SCREEN_W = Dimensions.get('window').width;
const GAP = 0;
const BOTTOM_PADDING = 176;
const STORY_UNIT = (SCREEN_W - GAP * 3) / 4;
const STORY_BIG_SIZE = STORY_UNIT * 2 + GAP;
const MICRO_GRID_COLS = 18;
const HEADER_FILTER_START = 54;
const HEADER_FILTER_END = 118;
const HEADER_DATE_CROSS_OFFSET = 150;
const STATUS_LIGHT_ENTER = 154;
const STATUS_LIGHT_EXIT = 88;
const STORY_INITIAL_PHOTO_COUNT = 240;
const STORY_PAGE_PHOTO_COUNT = 180;
const MICRO_INITIAL_PHOTO_COUNT = 720;
const MICRO_PAGE_PHOTO_COUNT = 540;
const PINCH_PREVIEW_MIN = 0.94;
const PINCH_PREVIEW_MAX = 1.08;

type PhotoWallMode = 'story' | 'micro';

type StoryTile = {
  photo: Photo;
  x: number;
  y: number;
  width: number;
  height: number;
};

type StoryBlockItem = {
  type: 'storyBlock';
  id: string;
  height: number;
  tiles: StoryTile[];
  dateLabel?: string;
  scrollLabel?: string;
  timeLabel?: string;
};

type MicroTile = {
  photo: Photo;
  x: number;
  y: number;
  size: number;
};

type MicroYearBlockItem = {
  type: 'microYearBlock';
  id: string;
  year: string;
  height: number;
  tiles: MicroTile[];
  scrollLabel: string;
  timeLabel?: string;
};

type QuiltSlot = {
  col: number;
  row: number;
  colSpan: number;
  rowSpan: number;
};

type QuiltPattern = {
  name: 'heroLeft' | 'heroRight' | 'heroCenter' | 'gridFour' | 'editorialNine' | 'doubleLead' | 'wide';
  slots: QuiltSlot[];
  heightUnits: number;
};

const HERO_LEFT_SLOTS: QuiltSlot[] = [
  { col: 0, row: 0, colSpan: 2, rowSpan: 2 },
  { col: 2, row: 0, colSpan: 1, rowSpan: 1 },
  { col: 3, row: 0, colSpan: 1, rowSpan: 1 },
  { col: 2, row: 1, colSpan: 1, rowSpan: 1 },
  { col: 3, row: 1, colSpan: 1, rowSpan: 1 },
];

const HERO_RIGHT_SLOTS: QuiltSlot[] = [
  { col: 2, row: 0, colSpan: 2, rowSpan: 2 },
  { col: 0, row: 0, colSpan: 1, rowSpan: 1 },
  { col: 1, row: 0, colSpan: 1, rowSpan: 1 },
  { col: 0, row: 1, colSpan: 1, rowSpan: 1 },
  { col: 1, row: 1, colSpan: 1, rowSpan: 1 },
];

const HERO_CENTER_SLOTS: QuiltSlot[] = [
  { col: 1, row: 0, colSpan: 2, rowSpan: 2 },
  { col: 0, row: 0, colSpan: 1, rowSpan: 1 },
  { col: 3, row: 0, colSpan: 1, rowSpan: 1 },
  { col: 0, row: 1, colSpan: 1, rowSpan: 1 },
  { col: 3, row: 1, colSpan: 1, rowSpan: 1 },
];

const GRID_FOUR_SLOTS: QuiltSlot[] = [0, 1, 2, 3].map((col) => ({
  col,
  row: 0,
  colSpan: 1,
  rowSpan: 1,
}));

const EDITORIAL_NINE_SLOTS: QuiltSlot[] = [
  { col: 2, row: 0, colSpan: 2, rowSpan: 2 },
  { col: 0, row: 0, colSpan: 1, rowSpan: 1 },
  { col: 1, row: 0, colSpan: 1, rowSpan: 1 },
  { col: 0, row: 1, colSpan: 1, rowSpan: 1 },
  { col: 1, row: 1, colSpan: 1, rowSpan: 1 },
  { col: 0, row: 2, colSpan: 1, rowSpan: 1 },
  { col: 1, row: 2, colSpan: 1, rowSpan: 1 },
  { col: 2, row: 2, colSpan: 1, rowSpan: 1 },
  { col: 3, row: 2, colSpan: 1, rowSpan: 1 },
];

const DOUBLE_LEAD_SLOTS: QuiltSlot[] = [
  { col: 0, row: 0, colSpan: 2, rowSpan: 2 },
  { col: 2, row: 0, colSpan: 2, rowSpan: 2 },
  { col: 0, row: 2, colSpan: 1, rowSpan: 1 },
  { col: 1, row: 2, colSpan: 1, rowSpan: 1 },
  { col: 2, row: 2, colSpan: 1, rowSpan: 1 },
  { col: 3, row: 2, colSpan: 1, rowSpan: 1 },
];

const WIDE_SLOTS: QuiltSlot[] = [
  { col: 0, row: 0, colSpan: 4, rowSpan: 2 },
  { col: 0, row: 2, colSpan: 1, rowSpan: 1 },
  { col: 1, row: 2, colSpan: 1, rowSpan: 1 },
  { col: 2, row: 2, colSpan: 1, rowSpan: 1 },
  { col: 3, row: 2, colSpan: 1, rowSpan: 1 },
];

function getPhotoRatio(photo: Photo): number {
  return photo.width > 0 && photo.height > 0 ? photo.width / photo.height : 1;
}

function getPatternForCount(photos: Photo[], blockIndex: number, previousWasWide: boolean): QuiltPattern {
  const first = photos[0];
  const count = photos.length;
  const canUseWide = !previousWasWide && count >= 5 && getPhotoRatio(first) >= 1.8 && blockIndex % 4 === 0;

  if (canUseWide) {
    return { name: 'wide', slots: WIDE_SLOTS, heightUnits: 3 };
  }

  if (count >= 9 && blockIndex % 4 === 2) {
    return { name: 'editorialNine', slots: EDITORIAL_NINE_SLOTS, heightUnits: 3 };
  }

  if (count >= 6 && blockIndex % 6 === 4) {
    return { name: 'doubleLead', slots: DOUBLE_LEAD_SLOTS, heightUnits: 3 };
  }

  if (count >= 5) {
    const variants = [
      { name: 'heroLeft' as const, slots: HERO_LEFT_SLOTS },
      { name: 'heroRight' as const, slots: HERO_RIGHT_SLOTS },
      { name: 'heroCenter' as const, slots: HERO_CENTER_SLOTS },
      { name: 'heroRight' as const, slots: HERO_RIGHT_SLOTS },
    ];
    const variant = variants[blockIndex % variants.length];
    return { ...variant, heightUnits: 2 };
  }

  return { name: 'gridFour', slots: GRID_FOUR_SLOTS.slice(0, count), heightUnits: 1 };
}

function getPatternPhotoCount(pattern: QuiltPattern, remaining: number): number {
  return Math.min(pattern.slots.length, remaining);
}

function clampValue(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function buildQuiltStoryBlock(photos: Photo[], blockIndex: number, previousWasWide: boolean, storyZoom: number): {
  height: number;
  tiles: StoryTile[];
  isWide: boolean;
  usedCount: number;
} {
  const unit = STORY_UNIT * storyZoom;
  const bigSize = unit * 2 + GAP;
  const canvasOffsetX = (SCREEN_W - unit * 4) / 2;

  if (photos.length === 1) {
    const ratio = getPhotoRatio(photos[0]);
    const preferredHeight = ratio > 1.45 ? bigSize : bigSize + unit * 0.45;
    return {
      height: preferredHeight,
      isWide: ratio > 1.45,
      usedCount: 1,
      tiles: [{
        photo: photos[0],
        x: canvasOffsetX,
        y: 0,
        width: unit * 4,
        height: preferredHeight,
      }],
    };
  }

  if (photos.length === 2) {
    const height = bigSize;
    return {
      height,
      isWide: false,
      usedCount: 2,
      tiles: photos.slice(0, 2).map((photo, index) => ({
        photo,
        x: canvasOffsetX + index * bigSize,
        y: 0,
        width: bigSize,
        height,
      })),
    };
  }

  if (photos.length === 3) {
    const heroOnRight = blockIndex % 2 === 1;
    const smallX = canvasOffsetX + (heroOnRight ? 0 : bigSize);
    const heroX = canvasOffsetX + (heroOnRight ? bigSize : 0);
    return {
      height: bigSize,
      isWide: false,
      usedCount: 3,
      tiles: [
        {
          photo: photos[0],
          x: heroX,
          y: 0,
          width: bigSize,
          height: bigSize,
        },
        {
          photo: photos[1],
          x: smallX,
          y: 0,
          width: bigSize,
          height: unit,
        },
        {
          photo: photos[2],
          x: smallX,
          y: unit,
          width: bigSize,
          height: unit,
        },
      ],
    };
  }

  const pattern = getPatternForCount(photos, blockIndex, previousWasWide);
  const count = getPatternPhotoCount(pattern, photos.length);
  const blockPhotos = photos.slice(0, count);
  const orderedPhotos = [
    ...blockPhotos.filter((photo) => photo.isFavorite),
    ...blockPhotos.filter((photo) => !photo.isFavorite),
  ];

  return {
    height: pattern.heightUnits * unit,
    isWide: pattern.name === 'wide',
    usedCount: count,
    tiles: pattern.slots.slice(0, count).map((slot, index) => ({
      photo: orderedPhotos[index],
      x: canvasOffsetX + slot.col * unit,
      y: slot.row * unit,
      width: slot.colSpan * unit,
      height: slot.rowSpan * unit,
    })),
  };
}

function formatStoryDateLabel(dateTaken: string): string {
  const today = new Date();
  const date = new Date(dateTaken);
  const todayKey = today.toISOString().slice(0, 10);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = yesterday.toISOString().slice(0, 10);

  if (dateTaken === todayKey) return '今天';
  if (dateTaken === yesterdayKey) return '昨天';
  return `${date.getMonth() + 1}月${date.getDate()}日`;
}

function buildStoryLayout(photos: Photo[], storyZoom: number): Array<DateRow | StoryBlockItem> {
  const result: Array<DateRow | StoryBlockItem> = [];
  let currentDate = '';
  let datePhotos: Photo[] = [];
  let blockIndex = 0;
  let previousWasWide = false;

  const flushDate = () => {
    if (datePhotos.length === 0) return;

    for (let i = 0; i < datePhotos.length;) {
      const chunk = datePhotos.slice(i);
      const block = buildQuiltStoryBlock(chunk, blockIndex, previousWasWide, storyZoom);
      const isFirstVisibleBlock = result.length === 0;
      result.push({
        type: 'storyBlock',
        id: `story-${currentDate}-${blockIndex}`,
        height: block.height + GAP,
        tiles: block.tiles,
        dateLabel: i === 0 && !isFirstVisibleBlock ? formatStoryDateLabel(currentDate) : undefined,
        scrollLabel: formatStoryDateLabel(currentDate),
        timeLabel: block.tiles[0]?.photo?.timeTaken?.slice(0, 5) ?? '',
      });
      previousWasWide = block.isWide;
      i += block.usedCount;
      blockIndex += 1;
    }

    datePhotos = [];
  };

  for (const photo of photos) {
    if (photo.dateTaken !== currentDate) {
      flushDate();
      currentDate = photo.dateTaken;
    }
    datePhotos.push(photo);
  }

  flushDate();
  return result;
}

function formatYearLabel(dateTaken: string): string {
  const year = new Date(dateTaken).getFullYear();
  return `${year} \u5e74`;
}

function buildMicroTimelineLayout(photos: Photo[]): MicroYearBlockItem[] {
  const tileSize = SCREEN_W / MICRO_GRID_COLS;
  const result: MicroYearBlockItem[] = [];
  let currentYear = '';
  let yearPhotos: Photo[] = [];

  const flushYear = () => {
    if (yearPhotos.length === 0) return;
    const year = currentYear;
    const rows = Math.ceil(yearPhotos.length / MICRO_GRID_COLS);
    result.push({
      type: 'microYearBlock',
      id: `micro-${year}`,
      year: `${year} \u5e74`,
      scrollLabel: `${year} \u5e74`,
      timeLabel: '',
      height: rows * tileSize,
      tiles: yearPhotos.map((photo, index) => ({
        photo,
        x: (index % MICRO_GRID_COLS) * tileSize,
        y: Math.floor(index / MICRO_GRID_COLS) * tileSize,
        size: tileSize,
      })),
    });
    yearPhotos = [];
  };

  for (const photo of photos) {
    const year = String(new Date(photo.dateTaken).getFullYear());
    if (year !== currentYear) {
      flushYear();
      currentYear = year;
    }
    yearPhotos.push(photo);
  }

  flushYear();
  return result;
}

const JustifiedPhotoCell = React.memo(function JustifiedPhotoCell({
  photo,
  cellWidth,
  cellHeight,
  selectionMode,
  isSelected,
  onPress,
  onLongPress,
  onThumbnailError,
}: {
  photo: Photo;
  cellWidth: number;
  cellHeight: number;
  selectionMode: boolean;
  isSelected: boolean;
  onPress: (photo: Photo) => void;
  onLongPress: (photo: Photo) => void;
  onThumbnailError?: (photo: Photo) => void;
}) {
  const { md3Theme: theme, tokens } = useAppTheme();
  const opacity = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const [fallbackToOriginal, setFallbackToOriginal] = React.useState(false);
  const imgUri = fallbackToOriginal ? photo.uri : (photo.thumbnailUri || photo.uri);

  React.useEffect(() => {
    setFallbackToOriginal(false);
    opacity.value = 0;
  }, [photo.id]);

  return (
    <Pressable
      onPress={() => onPress(photo)}
      onLongPress={() => onLongPress(photo)}
      style={[
        cellStyles.wrap,
        {
          width: cellWidth,
          height: cellHeight,
          backgroundColor: photo.color || theme.colors.surfaceVariant,
        },
        isSelected && cellStyles.selected,
      ]}
    >
      <Animated.View pointerEvents="none" sharedTransitionTag={`photo-${photo.id}`} style={[animatedStyle, { width: cellWidth, height: cellHeight }]}>
        <Image
          source={{ uri: imgUri, cache: 'force-cache' }}
          style={{ width: cellWidth, height: cellHeight }}
          resizeMode="cover"
          fadeDuration={0}
          onLoad={() => {
            opacity.value = withTiming(1, { duration: 120 });
          }}
          onError={() => {
            if (!fallbackToOriginal && photo.thumbnailUri) {
              setFallbackToOriginal(true);
              onThumbnailError?.(photo);
            }
          }}
        />
      </Animated.View>
      {selectionMode && (
        <View style={[cellStyles.checkCircle, { borderColor: theme.colors.surfaceContainerLowest }]}>
          <View style={[cellStyles.checkInner, isSelected && { backgroundColor: theme.colors.onSurface }]} />
        </View>
      )}
      {photo.isFavorite && !selectionMode && (
        <View style={[cellStyles.favBadge, { backgroundColor: theme.colors.primary + '99' }]}>
          <LineIcon name="heart" size={12} color={theme.colors.surfaceContainerLowest} />
        </View>
      )}
      {photo.mediaType === 'video' && !selectionMode && (
        <VideoIndicator duration={photo.duration} />
      )}
    </Pressable>
  );
}, (prev, next) => {
  return (
    prev.photo.id === next.photo.id &&
    prev.photo.isFavorite === next.photo.isFavorite &&
    prev.photo.color === next.photo.color &&
    prev.photo.mediaType === next.photo.mediaType &&
    prev.photo.duration === next.photo.duration &&
    prev.cellWidth === next.cellWidth &&
    prev.cellHeight === next.cellHeight &&
    prev.selectionMode === next.selectionMode &&
    prev.isSelected === next.isSelected
  );
});

const cellStyles = StyleSheet.create({
  wrap: {
    overflow: 'hidden',
    borderRadius: 0,
    margin: GAP / 2,
  },
  selected: { opacity: 0.7 },
  checkCircle: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  checkInner: { width: 14, height: 14, borderRadius: 7 },
  favBadge: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
});

function SelectionToolbar({
  selectedCount,
  onFavorite,
  onDelete,
  onHide,
  onSelectAll,
}: {
  selectedCount: number;
  onFavorite: () => void;
  onDelete: () => void;
  onHide: () => void;
  onSelectAll: () => void;
}) {
  const { md3Theme: theme } = useAppTheme();
  const barOpacity = useSharedValue(0);
  const barTranslateY = useSharedValue(20);

  React.useEffect(() => {
    barOpacity.value = withTiming(selectedCount > 0 ? 1 : 0, { duration: 200 });
    barTranslateY.value = withTiming(selectedCount > 0 ? 0 : 20, { duration: 200 });
  }, [selectedCount]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: barOpacity.value,
    transform: [{ translateY: barTranslateY.value }],
  }));

  if (selectedCount === 0) return null;

  return (
    <Animated.View style={[selToolbarStyles.container, { backgroundColor: theme.colors.surfaceContainerLowest }, animatedStyle]}>
      <Pressable style={selToolbarStyles.btn} onPress={onFavorite}>
        <LineIcon name="heart" size={20} color={theme.colors.onSurface} />
        <Text style={[selToolbarStyles.btnText, { color: theme.colors.onSurface }]}>收藏</Text>
      </Pressable>
      <Pressable style={selToolbarStyles.btn} onPress={onHide}>
        <LineIcon name="eye-off" size={20} color={theme.colors.outline} />
        <Text style={[selToolbarStyles.btnText, { color: theme.colors.outline }]}>隐藏</Text>
      </Pressable>
      <Pressable style={selToolbarStyles.btn} onPress={onDelete}>
        <LineIcon name="trash" size={20} color={theme.colors.error} />
        <Text style={[selToolbarStyles.btnText, { color: theme.colors.error }]}>删除</Text>
      </Pressable>
      <Pressable style={selToolbarStyles.btn} onPress={onSelectAll}>
        <LineIcon name="check-circle" size={20} color={theme.colors.onSurface} />
        <Text style={[selToolbarStyles.btnText, { color: theme.colors.onSurface }]}>全选</Text>
      </Pressable>
    </Animated.View>
  );
}

const selToolbarStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: BOTTOM_PADDING + 12,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderRadius: 20,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  btn: { alignItems: 'center', gap: 3 },
  btnText: { fontSize: 11, fontWeight: '600' },
});

function ImportProgressOverlay({
  isImporting,
  progress,
  onCancel,
}: {
  isImporting: boolean;
  progress: { current: number; total: number; currentFile: string; phase: string } | null;
  onCancel: () => void;
}) {
  const { md3Theme: theme, tokens: overlayTokens } = useAppTheme();
  if (!isImporting) return null;
  const pct = progress && progress.total > 0 ? Math.round((progress.current / progress.total) * 100) : 0;
  return (
    <View style={[importOverlayStyles.container, { backgroundColor: overlayTokens.scrim }]}>
      <View style={[importOverlayStyles.card, { backgroundColor: theme.colors.surfaceContainerLowest }]}>
        <Text style={[importOverlayStyles.title, { color: theme.colors.onSurface }]}>
          {progress?.phase === 'picking' ? '选择照片中…' : `导入中 ${pct}%`}
        </Text>
        <View style={[importOverlayStyles.track, { backgroundColor: theme.colors.surfaceVariant }]}>
          <View style={[importOverlayStyles.fill, { width: `${pct}%`, backgroundColor: theme.colors.onSurface }]} />
        </View>
        {progress && progress.total > 0 && (
          <Text style={[importOverlayStyles.detail, { color: theme.colors.outline }]}>{progress.current} / {progress.total}</Text>
        )}
        <Pressable style={[importOverlayStyles.cancelBtn, { backgroundColor: theme.colors.surface }]} onPress={onCancel}>
          <Text style={[importOverlayStyles.cancelText, { color: theme.colors.outline }]}>取消</Text>
        </Pressable>
      </View>
    </View>
  );
}

const importOverlayStyles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 200,
  },
  card: {
    borderRadius: 20,
    padding: 24,
    width: '80%',
    alignItems: 'center',
  },
  title: { fontSize: 16, fontWeight: '700', marginBottom: 16 },
  track: { width: '100%', height: 6, borderRadius: 3, overflow: 'hidden' },
  fill: { height: 6, borderRadius: 3 },
  detail: { fontSize: 13, marginTop: 8 },
  cancelBtn: { marginTop: 16, paddingHorizontal: 24, paddingVertical: 8, borderRadius: 999 },
  cancelText: { fontSize: 14, fontWeight: '600' },
});

type AnyLayoutItem = LayoutItem | MasonryLayoutItem | StoryBlockItem | MicroYearBlockItem;

export function PhotosScreen({ navigation }: TabScreenProps<'PhotosTab'>) {
  const { md3Theme: theme, tokens: screenTokens } = useAppTheme();
  const insets = useSafeAreaInsets();
  const { height: screenHeight } = useWindowDimensions();
  const { enqueueRepair } = useThumbnailPrefetch();
  const [targetRowHeight, setTargetRowHeight] = useState(120);
  const [isHeaderImmersive, setIsHeaderImmersive] = useState(false);
  const [isFastScrollerVisible, setIsFastScrollerVisible] = useState(false);
  const [fastScrollLabel, setFastScrollLabel] = useState('');
  const [headerDateLabel, setHeaderDateLabel] = useState('');
  const [wallMode, setWallMode] = useState<PhotoWallMode>('story');
  const [storyZoom, setStoryZoom] = useState(1);
  const fastHideTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const fastDraggingRef = React.useRef(false);
  const fastScrollFrameRef = React.useRef<number | null>(null);
  const pendingFastOffsetRef = React.useRef(0);
  const lastFastScrollFrameAtRef = React.useRef(0);
  const lastFastScrollOffsetRef = React.useRef(0);
  const lastFastMetaAtRef = React.useRef(0);
  const fastScrollLabelRef = React.useRef('');
  const headerDateLabelRef = React.useRef('');
  const listRef = React.useRef<any>(null);
  const scrollY = useSharedValue(0);
  const fastDragging = useSharedValue(false);
  const pinchPreviewScale = useSharedValue(1);
  const pinchPreviewOpacity = useSharedValue(1);

  const masonryEnabled = useSettingsStore((s) => s.masonryEnabled);
  const gridColumns = useSettingsStore((s) => s.gridColumns);
  const setGridColumns = useSettingsStore((s) => s.setGridColumns);

  const gradientAnimStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [0, HEADER_FILTER_START, HEADER_FILTER_END], [0, 0, 0.86], 'clamp'),
  }));

  const titleAnimStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      scrollY.value,
      [0, HEADER_FILTER_START, HEADER_FILTER_END],
      [theme.colors.onSurface, theme.colors.onSurface, '#FFFFFF'],
    ),
  }));

  const subtitleAnimStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      scrollY.value,
      [0, HEADER_FILTER_START, HEADER_FILTER_END],
      ['rgba(18,18,18,0.92)', 'rgba(18,18,18,0.92)', '#FFFFFF'],
    ),
  }));

  const iconLightStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [0, HEADER_FILTER_START, HEADER_FILTER_END], [1, 1, 0], 'clamp'),
  }));

  const iconDarkStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [0, HEADER_FILTER_START, HEADER_FILTER_END], [0, 0, 1], 'clamp'),
  }));

  const btnBgAnimStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
        scrollY.value,
        [0, HEADER_FILTER_START, HEADER_FILTER_END],
        ['rgba(44,62,53,0.10)', 'rgba(44,62,53,0.10)', theme.colors.primary],
      ),
  }));

  const pinchPreviewStyle = useAnimatedStyle(() => ({
    opacity: pinchPreviewOpacity.value,
    transform: [{ scale: pinchPreviewScale.value }],
  }));

  const photos = usePhotos();
  const isHydrated = usePhotoStore((s) => s.isHydrated);
  const selectionMode = usePhotoStore((s) => s.selectionMode);
  const selectedIds = usePhotoStore((s) => s.selectedIds);
  const enterSelection = usePhotoStore((s) => s.enterSelection);
  const exitSelection = usePhotoStore((s) => s.exitSelection);
  const toggleSelection = usePhotoStore((s) => s.toggleSelection);
  const selectAll = usePhotoStore((s) => s.selectAll);
  const batchFavorite = usePhotoStore((s) => s.batchFavorite);
  const batchDelete = usePhotoStore((s) => s.batchDelete);
  const batchHide = usePhotoStore((s) => s.batchHide);
  const showToast = useUiStore((s) => s.showToast);
  const { importFromGallery, isImporting, progress, cancelImport } = usePhotoImport();
  const [visiblePhotoCount, setVisiblePhotoCount] = useState(STORY_INITIAL_PHOTO_COUNT);

  const initialPhotoCount = wallMode === 'micro' ? MICRO_INITIAL_PHOTO_COUNT : STORY_INITIAL_PHOTO_COUNT;
  const pagePhotoCount = wallMode === 'micro' ? MICRO_PAGE_PHOTO_COUNT : STORY_PAGE_PHOTO_COUNT;

  useEffect(() => {
    setVisiblePhotoCount(initialPhotoCount);
  }, [initialPhotoCount, photos]);

  const visiblePhotos = useMemo(
    () => photos.slice(0, Math.min(visiblePhotoCount, photos.length)),
    [photos, visiblePhotoCount],
  );

  const hasMorePhotos = visiblePhotos.length < photos.length;

  const loadMorePhotos = useCallback(() => {
    if (!hasMorePhotos) return;
    setVisiblePhotoCount((count) => Math.min(count + pagePhotoCount, photos.length));
  }, [hasMorePhotos, pagePhotoCount, photos.length]);

  const allPhotoIds = useMemo(() => photos.map((p) => p.id), [photos]);

  const layoutData = useMemo<AnyLayoutItem[]>(
    () => wallMode === 'micro'
      ? buildMicroTimelineLayout(visiblePhotos)
      : buildStoryLayout(visiblePhotos, storyZoom),
    [visiblePhotos, storyZoom, wallMode],
  );
  const listKey = wallMode === 'micro' ? 'micro-wall' : 'story-wall';
  const contentTopPadding = wallMode === 'micro' ? insets.top + 128 : insets.top + 86;
  const fastScrollTop = insets.top + 70;
  const fastScrollRange = Math.max(
    screenHeight - fastScrollTop - 140,
    100,
  );
  const contentHeight = useMemo(
    () => layoutData.reduce((sum, item) => {
      if (item.type === 'date') return sum + DATE_ITEM_HEIGHT;
      if (item.type === 'storyBlock' || item.type === 'microYearBlock') return sum + item.height;
      if ('items' in item) return sum + item.rowHeight + GAP;
      return sum;
    }, 0),
    [layoutData],
  );
  const maxScrollOffset = Math.max(
    contentHeight + contentTopPadding + BOTTOM_PADDING - screenHeight,
    1,
  );

  const getFastScrollLabel = useCallback((offset: number) => {
    let cursor = contentTopPadding;
    let fallback = '';
    for (const item of layoutData) {
      const length =
        item.type === 'date'
          ? DATE_ITEM_HEIGHT
          : item.type === 'storyBlock'
            ? item.height
            : item.type === 'microYearBlock'
              ? item.height
            : 'items' in item
              ? item.rowHeight + GAP
              : 0;

      if (item.type === 'storyBlock' && item.scrollLabel) {
        fallback = item.scrollLabel;
      }
      if (item.type === 'microYearBlock') {
        fallback = item.scrollLabel;
      }

      if (offset <= cursor + length) {
        return item.type === 'storyBlock' || item.type === 'microYearBlock'
          ? item.scrollLabel ?? fallback
          : fallback;
      }
      cursor += length;
    }
    return fallback;
  }, [contentTopPadding, layoutData]);

  const revealFastScroller = useCallback(() => {
    if (!isFastScrollerVisible) {
      setIsFastScrollerVisible(true);
    }
    if (fastHideTimerRef.current) clearTimeout(fastHideTimerRef.current);
    fastHideTimerRef.current = setTimeout(() => {
      setIsFastScrollerVisible(false);
    }, 900);
  }, [isFastScrollerVisible]);

  const getTimeForOffset = useCallback((offset: number) => {
    let cursor = contentTopPadding;
    for (const item of layoutData) {
      const length =
        item.type === 'date'
          ? DATE_ITEM_HEIGHT
          : item.type === 'storyBlock'
            ? item.height
            : item.type === 'microYearBlock'
              ? item.height
            : 'items' in item
              ? item.rowHeight + GAP
              : 0;

      if (offset <= cursor + length) {
        if (item.type === 'storyBlock' || item.type === 'microYearBlock') {
          return item.timeLabel ?? '';
        }
        return '';
      }
      cursor += length;
    }
    return '';
  }, [layoutData, contentTopPadding]);

  useEffect(() => () => {
    if (fastHideTimerRef.current) clearTimeout(fastHideTimerRef.current);
    if (fastScrollFrameRef.current !== null) cancelAnimationFrame(fastScrollFrameRef.current);
  }, []);

  const updateScrollMeta = useCallback((offset: number, force = false) => {
    setIsHeaderImmersive((prev) => {
      if (prev) return offset > STATUS_LIGHT_EXIT;
      const next = offset > STATUS_LIGHT_ENTER;
      return prev === next ? prev : next;
    });

    if (!force) {
      const now = Date.now();
      if (now - lastFastMetaAtRef.current < 50) return;
      lastFastMetaAtRef.current = now;
    }

    const nextLabel = getFastScrollLabel(offset);
    if (nextLabel && fastScrollLabelRef.current !== nextLabel) {
      fastScrollLabelRef.current = nextLabel;
      setFastScrollLabel(nextLabel);
    }

    const nextHeaderLabel = getFastScrollLabel(offset + HEADER_DATE_CROSS_OFFSET);
    if (nextHeaderLabel && headerDateLabelRef.current !== nextHeaderLabel) {
      headerDateLabelRef.current = nextHeaderLabel;
      setHeaderDateLabel(nextHeaderLabel);
    }
  }, [getFastScrollLabel, wallMode]);

  const lastRevealTimeRef = React.useRef(0);

  const updateScrollUi = useCallback((offset: number) => {
    updateScrollMeta(offset);
    if (fastDraggingRef.current) return;
    const now = Date.now();
    if (now - lastRevealTimeRef.current >= 200) {
      lastRevealTimeRef.current = now;
      revealFastScroller();
    }
  }, [revealFastScroller, updateScrollMeta]);

  const scrollThumbY = useSharedValue(0);
  const scrollVelocityY = useSharedValue(0);

  useEffect(() => {
    const initialLabel = getFastScrollLabel(0);
    fastScrollLabelRef.current = initialLabel;
    setFastScrollLabel(initialLabel);
    headerDateLabelRef.current = initialLabel;
    setHeaderDateLabel(initialLabel);
  }, [getFastScrollLabel]);

  useEffect(() => {
    setIsHeaderImmersive(false);
    scrollY.value = 0;
    scrollThumbY.value = 0;
    listRef.current?.scrollToOffset?.({ offset: 0, animated: false });
  }, [scrollY, wallMode, scrollThumbY]);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (e) => {
      if (fastDraggingRef.current) return;
      scrollY.value = e.contentOffset.y;
      const ratio = maxScrollOffset <= 0 ? 0 : e.contentOffset.y / maxScrollOffset;
      scrollThumbY.value = ratio * fastScrollRange;
    },
  });

  const fastScrollerStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isFastScrollerVisible ? 1 : 0.38, { duration: isFastScrollerVisible ? 120 : 240 }),
    transform: [{ translateY: scrollThumbY.value }],
  }));

  const fastScrollTrackStyle = useAnimatedStyle(() => ({
    height: fastScrollRange,
    opacity: withTiming(isFastScrollerVisible ? 1 : 0.3, { duration: 150 }),
  }));

  const fastScrollThumbHeight = fastScrollRange > 0 ? Math.max(40, (fastScrollRange / maxScrollOffset) * 100) : 40;

  // 同步滑块位置到列表
  useAnimatedReaction(
    () => scrollThumbY.value,
    (thumbY) => {
      if (!fastDragging.value) return;
      const ratio = fastScrollRange <= 0 ? 0 : thumbY / fastScrollRange;
      const offset = ratio * maxScrollOffset;
      listRef.current?.scrollToOffset({ offset, animated: false });
    },
    [fastScrollRange, maxScrollOffset],
  );

  const performInertiaScroll = useCallback((startY: number, velocityY: number) => {
    let velocity = velocityY * 0.06;
    let currentY = startY;
    
    if (Math.abs(velocity) < 50) {
      const ratio = fastScrollRange <= 0 ? 0 : scrollThumbY.value / fastScrollRange;
      const offset = ratio * maxScrollOffset;
      listRef.current?.scrollToOffset({ offset, animated: false });
      updateScrollMeta(offset, true);
      return;
    }
    
    const inertiaFrame = () => {
      velocity *= 0.92;
      currentY -= velocity;
      scrollThumbY.value = currentY;
      
      if (currentY < 0 || currentY > fastScrollRange || Math.abs(velocity) < 1) {
        const finalY = clampValue(currentY, 0, fastScrollRange);
        scrollThumbY.value = finalY;
        const ratio = fastScrollRange <= 0 ? 0 : finalY / fastScrollRange;
        const offset = ratio * maxScrollOffset;
        listRef.current?.scrollToOffset({ offset, animated: false });
        updateScrollMeta(offset, true);
        revealFastScroller();
        fastScrollFrameRef.current = null;
        return;
      }
      
      fastScrollFrameRef.current = requestAnimationFrame(inertiaFrame);
    };
    
    fastScrollFrameRef.current = requestAnimationFrame(inertiaFrame);
  }, [fastScrollRange, maxScrollOffset, revealFastScroller]);

  const scrollToFastOffset = useCallback((pageY: number) => {
    const localY = clampValue(pageY - fastScrollTop, 0, fastScrollRange);
    const ratio = fastScrollRange <= 0 ? 0 : localY / fastScrollRange;
    const offset = ratio * maxScrollOffset;

    scrollY.value = offset;
    scrollThumbY.value = localY;
    updateScrollMeta(offset, true);
  }, [fastScrollRange, fastScrollTop, maxScrollOffset, updateScrollMeta]);

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .minDistance(0)
        .maxPointers(1)
        .onStart((e) => {
          if (fastScrollFrameRef.current !== null) {
            cancelAnimationFrame(fastScrollFrameRef.current);
            fastScrollFrameRef.current = null;
          }
          fastDraggingRef.current = true;
          fastDragging.value = true;
          if (fastHideTimerRef.current) clearTimeout(fastHideTimerRef.current);
          setIsFastScrollerVisible(true);
          scrollToFastOffset(e.absoluteY);
        })
        .onUpdate((e) => {
          scrollToFastOffset(e.absoluteY);
        })
        .onEnd((e) => {
          fastDraggingRef.current = false;
          fastDragging.value = false;
          performInertiaScroll(scrollThumbY.value, -e.velocityY);
        })
        .onFinalize(() => {
          fastDraggingRef.current = false;
          fastDragging.value = false;
        })
        .runOnJS(true),
    [scrollToFastOffset, performInertiaScroll, setIsFastScrollerVisible],
  );

  const commitPinchScale = useCallback(
    (scale: number) => {
      InteractionManager.runAfterInteractions(() => {
        if (wallMode === 'micro') {
          if (scale > 1.06) {
            setWallMode('story');
            setStoryZoom(1);
            hapticSelection();
          }
          return;
        }

        if (scale < 0.96) {
          setWallMode('micro');
          setStoryZoom(1);
          hapticSelection();
          return;
        }

        if (masonryEnabled) {
          if (scale < 0.8) {
            const next = Math.max(2, gridColumns - 1);
            if (next !== gridColumns) setGridColumns(next);
          } else if (scale > 1.2) {
            const next = Math.min(5, gridColumns + 1);
            if (next !== gridColumns) setGridColumns(next);
          }
        } else {
          let next = targetRowHeight;
          if (scale < 0.8) next = Math.min(240, targetRowHeight + 30);
          else if (scale > 1.2) next = Math.max(60, targetRowHeight - 30);
          if (next !== targetRowHeight) setTargetRowHeight(next);
        }
      });
    },
    [masonryEnabled, gridColumns, setGridColumns, targetRowHeight, wallMode],
  );

  const pinchGesture = useMemo(
    () =>
      Gesture.Pinch()
        .onBegin(() => {
          pinchPreviewOpacity.value = withTiming(0.96, { duration: 80 });
        })
        .onUpdate((e) => {
          pinchPreviewScale.value = clampValue(
            1 + (e.scale - 1) * 0.16,
            PINCH_PREVIEW_MIN,
            PINCH_PREVIEW_MAX,
          );
        })
        .onEnd((e) => {
          pinchPreviewScale.value = withTiming(1, { duration: 140 });
          pinchPreviewOpacity.value = withTiming(1, { duration: 140 });
          runOnJS(commitPinchScale)(e.scale);
        })
        .onFinalize(() => {
          pinchPreviewScale.value = withTiming(1, { duration: 140 });
          pinchPreviewOpacity.value = withTiming(1, { duration: 140 });
        })
        .runOnJS(false),
    [commitPinchScale, pinchPreviewOpacity, pinchPreviewScale],
  );

  const handlePhotoPress = useCallback(
    (photo: Photo) => {
      if (selectionMode) {
        toggleSelection(photo.id);
      } else {
        navigation.navigate('Lightbox', { photoId: photo.id, photoIds: allPhotoIds });
      }
    },
    [selectionMode, toggleSelection, allPhotoIds, navigation],
  );

  const handleLongPress = useCallback(
    (photo: Photo) => {
      hapticMedium();
      if (!selectionMode) {
        enterSelection();
        toggleSelection(photo.id);
      }
    },
    [selectionMode, enterSelection, toggleSelection],
  );

  const handleBatchFavorite = useCallback(() => {
    batchFavorite();
    hapticSuccess();
    showToast('已更新收藏状态', 'success');
  }, [batchFavorite, showToast]);

  const handleBatchDelete = useCallback(() => {
    batchDelete();
    hapticWarning();
    showToast('已移至回收站', 'success');
  }, [batchDelete, showToast]);

  const handleBatchHide = useCallback(() => {
    batchHide();
    hapticSelection();
    showToast('已隐藏', 'success');
  }, [batchHide, showToast]);

  const handleSelectAll = useCallback(() => {
    selectAll(photos.map((p) => p.id));
  }, [selectAll, photos]);

  const renderItem = useCallback(
    ({ item }: { item: AnyLayoutItem }) => {
      if (item.type === 'date') {
        return (
          <View style={[styles.dateTag, { backgroundColor: theme.colors.surfaceContainerLowest + 'D1' }]}>
            <Text style={[styles.dateTagText, { color: theme.colors.onSurface }]}>{item.label}</Text>
          </View>
        );
      }

      if (item.type === 'storyBlock') {
        return (
          <View style={[styles.storyBlock, { height: item.height }]}>
            {item.tiles.map((tile) => (
              <Pressable
                key={tile.photo.id}
                onPress={() => handlePhotoPress(tile.photo)}
                onLongPress={() => handleLongPress(tile.photo)}
                style={[
                  styles.storyTile,
                  {
                    left: tile.x,
                    top: tile.y,
                    width: tile.width,
                    height: tile.height,
                    backgroundColor: tile.photo.color || theme.colors.surfaceVariant,
                  },
                  selectedIds.has(tile.photo.id) && styles.storyTileSelected,
                ]}
              >
                <Image
                  source={{ uri: tile.photo.thumbnailUri || tile.photo.uri, cache: 'force-cache' }}
                  style={styles.storyTileImage}
                  resizeMode="cover"
                  fadeDuration={0}
                />
                {selectionMode && (
                  <View style={[cellStyles.checkCircle, { borderColor: theme.colors.surfaceContainerLowest }]}>
                    <View
                      style={[
                        cellStyles.checkInner,
                        selectedIds.has(tile.photo.id) && { backgroundColor: theme.colors.onSurface },
                      ]}
                    />
                  </View>
                )}
                {tile.photo.mediaType === 'video' && !selectionMode && (
                  <VideoIndicator duration={tile.photo.duration} />
                )}
              </Pressable>
            ))}
            {item.dateLabel && (
              <View pointerEvents="none" style={styles.floatingDateTag}>
                <Text style={styles.floatingDateText}>{item.dateLabel}</Text>
              </View>
            )}
          </View>
        );
      }

      if (item.type === 'microYearBlock') {
        return (
          <View style={[styles.microYearBlock, { height: item.height }]}>
            {item.tiles.map((tile) => (
              <Pressable
                key={tile.photo.id}
                onPress={() => handlePhotoPress(tile.photo)}
                onLongPress={() => handleLongPress(tile.photo)}
                style={[
                  styles.microTile,
                  {
                    left: tile.x,
                    top: tile.y,
                    width: tile.size,
                    height: tile.size,
                    backgroundColor: tile.photo.color || theme.colors.surfaceVariant,
                  },
                  selectedIds.has(tile.photo.id) && styles.storyTileSelected,
                ]}
              >
                <Image
                  source={{ uri: tile.photo.thumbnailUri || tile.photo.uri, cache: 'force-cache' }}
                  style={styles.storyTileImage}
                  resizeMode="cover"
                  fadeDuration={0}
                />
              </Pressable>
            ))}
            <View pointerEvents="none" style={styles.microYearPill}>
              <Text style={styles.microYearText}>{item.year}</Text>
            </View>
          </View>
        );
      }

      if ('rowHeight' in item && 'items' in item) {
        if (masonryEnabled) {
          return (
            <View style={[styles.masonryRow, { height: item.rowHeight + GAP, gap: GAP }]}>
              {item.items.map((ri) => (
                <MasonryPhotoCell
                  key={ri.photo.id}
                  photo={ri.photo}
                  width={ri.width}
                  height={ri.height}
                  selectionMode={selectionMode}
                  isSelected={selectedIds.has(ri.photo.id)}
                  onPress={() => handlePhotoPress(ri.photo)}
                  onLongPress={() => handleLongPress(ri.photo)}
                  onThumbnailError={enqueueRepair}
                />
              ))}
            </View>
          );
        }

        const justifiedItem = item as LayoutItem & { type: 'row'; rowHeight: number; items: any[] };
        return (
          <View style={[styles.row, { height: justifiedItem.rowHeight + GAP }]}>
            {justifiedItem.items.map((rowItem) => (
              <JustifiedPhotoCell
                key={rowItem.photo.id}
                photo={rowItem.photo}
                cellWidth={rowItem.width}
                cellHeight={rowItem.height}
                selectionMode={selectionMode}
                isSelected={selectedIds.has(rowItem.photo.id)}
                onPress={handlePhotoPress}
                onLongPress={handleLongPress}
                onThumbnailError={enqueueRepair}
              />
            ))}
          </View>
        );
      }

      return null;
    },
    [masonryEnabled, selectionMode, selectedIds, handlePhotoPress, handleLongPress, theme],
  );

  const getItemLayout = useCallback(
    (_: any, index: number) => {
      let offset = 0;
      for (let i = 0; i < index; i++) {
        const item = layoutData[i];
        if (item.type === 'date') {
          offset += DATE_ITEM_HEIGHT;
        } else if (item.type === 'storyBlock' || item.type === 'microYearBlock') {
          offset += item.height;
        } else if ('items' in item) {
          offset += item.rowHeight + GAP;
        }
      }
      const item = layoutData[index];
      let length: number;
      if (item.type === 'date') {
        length = DATE_ITEM_HEIGHT;
      } else if (item.type === 'storyBlock' || item.type === 'microYearBlock') {
        length = item.height;
      } else if ('items' in item) {
        length = item.rowHeight + GAP;
      } else {
        length = 100;
      }
      return { offset, length, index };
    },
    [layoutData, masonryEnabled],
  );

  if (!isHydrated) {
    return (
      <View style={[styles.loading, { backgroundColor: theme.colors.surface }]}>
        <ActivityIndicator size="large" color={theme.colors.onSurface} />
      </View>
    );
  }

  const headerTitleText = selectionMode ? `\u5df2\u9009 ${selectedIds.size} \u9879` : '\u7167\u7247';
  const listFooter = hasMorePhotos ? (
    <View style={styles.paginationFooter}>
      <ActivityIndicator size="small" color={theme.colors.primary} />
    </View>
  ) : null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={isHeaderImmersive ? 'light-content' : 'dark-content'}
      />
      <View style={[styles.root, { backgroundColor: theme.colors.surface }]}>
        {photos.length === 0 ? (
          <View style={styles.empty}>
            <LineIcon name="image" size={48} color={theme.colors.outlineVariant} />
            <Text style={[styles.emptyText, { color: theme.colors.outline }]}>还没有照片</Text>
            <Pressable style={[styles.emptyBtn, { backgroundColor: theme.colors.onSurface }]} onPress={importFromGallery}>
              <Text style={[styles.emptyBtnText, { color: theme.colors.surfaceContainerLowest }]}>导入照片</Text>
            </Pressable>
          </View>
        ) : (
          <GestureDetector gesture={pinchGesture}>
            <Animated.View style={[styles.wallSurface, pinchPreviewStyle]}>
              <Animated.FlatList
                ref={listRef}
                key={listKey}
                data={layoutData}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                getItemLayout={getItemLayout}
                contentContainerStyle={{ paddingTop: contentTopPadding, paddingBottom: BOTTOM_PADDING }}
                showsVerticalScrollIndicator={false}
                removeClippedSubviews={false}
                initialNumToRender={28}
                maxToRenderPerBatch={16}
                windowSize={9}
                onEndReached={loadMorePhotos}
                onEndReachedThreshold={0.8}
                ListFooterComponent={listFooter}
                contentInsetAdjustmentBehavior="never"
                onScroll={onScroll}
                scrollEventThrottle={16}
              />
            </Animated.View>
          </GestureDetector>
        )}

        <Animated.View
          style={[
            styles.gradient,
            { height: insets.top + 260 },
            gradientAnimStyle,
          ]}
          pointerEvents="none"
        >
          <LinearGradient
            colors={[
              'rgba(112,112,112,0.82)',
              'rgba(178,178,178,0.72)',
              'rgba(218,218,218,0.44)',
              'rgba(230,230,230,0)',
            ]}
            locations={[0, 0.34, 0.68, 1]}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>

        <Animated.View style={[styles.floatingHeader, { paddingTop: insets.top + 10 }]}>
          <View style={styles.headerTitleStack}>
            <Animated.Text style={[styles.headerTitle, titleAnimStyle]}>
              {headerTitleText}
            </Animated.Text>
            {!selectionMode && (
              <Animated.Text style={[styles.headerSubtitle, subtitleAnimStyle]}>{headerDateLabel}</Animated.Text>
            )}
          </View>
          <View style={styles.headerActions}>
            {selectionMode ? (
              <Pressable style={styles.headerBtn} onPress={() => { hapticSelection(); exitSelection(); }}>
                <Text style={[styles.cancelText, { color: '#FFFFFF' }]}>
                  取消
                </Text>
              </Pressable>
            ) : (
              <>
                <Pressable onPress={() => navigation.navigate('Search')}>
                  <Animated.View style={[styles.headerBtnCircle, btnBgAnimStyle]}>
                    <View style={styles.iconStack}>
                      <Animated.View style={[styles.iconAbsolute, iconLightStyle]}>
                        <LineIcon name="search" size={20} color={theme.colors.onSurface} />
                      </Animated.View>
                      <Animated.View style={[styles.iconAbsolute, iconDarkStyle]}>
                        <LineIcon name="search" size={20} color="#FFFFFF" />
                      </Animated.View>
                    </View>
                  </Animated.View>
                </Pressable>
                <Pressable onPress={() => navigation.navigate('Settings')}>
                  <Animated.View style={[styles.headerBtnCircle, btnBgAnimStyle]}>
                    <View style={styles.iconStack}>
                      <Animated.View style={[styles.iconAbsolute, iconLightStyle]}>
                        <LineIcon name="more" size={20} color={theme.colors.onSurface} />
                      </Animated.View>
                      <Animated.View style={[styles.iconAbsolute, iconDarkStyle]}>
                        <LineIcon name="more" size={20} color="#FFFFFF" />
                      </Animated.View>
                    </View>
                  </Animated.View>
                </Pressable>
              </>
            )}
          </View>
        </Animated.View>

        {photos.length > 0 && (
          <View style={styles.fastScrollerContainer} pointerEvents="box-none">
            <GestureDetector gesture={panGesture}>
              <Animated.View
                style={[
                  styles.fastScroller,
                  { top: fastScrollTop },
                  fastScrollerStyle,
                ]}
              >
                <View style={styles.fastScrollLabel}>
                  <Text style={styles.fastScrollDateText}>{fastScrollLabel}</Text>
                </View>
                <View style={styles.fastScrollThumb}>
                  <View style={styles.fastScrollThumbBar} />
                </View>
              </Animated.View>
            </GestureDetector>
          </View>
        )}

        <SelectionToolbar
          selectedCount={selectedIds.size}
          onFavorite={handleBatchFavorite}
          onDelete={handleBatchDelete}
          onHide={handleBatchHide}
          onSelectAll={handleSelectAll}
        />

        <ImportProgressOverlay
          isImporting={isImporting}
          progress={progress}
          onCancel={cancelImport}
        />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  wallSurface: {
    flex: 1,
  },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  paginationFooter: {
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 5,
  },
  floatingHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  headerTitleStack: {
    flex: 1,
    minHeight: 54,
    justifyContent: 'center',
  },
  immersiveHeaderTitle: {
    color: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 28,
    lineHeight: 32,
    fontWeight: '800',
    letterSpacing: 0,
  },
  headerSubtitle: {
    marginTop: 0,
    color: 'rgba(18,18,18,0.92)',
    fontSize: 15,
    lineHeight: 18,
    fontWeight: '700',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
    alignSelf: 'flex-start',
    paddingTop: 16,
  },
  headerBtnCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(44,62,53,0.12)',
  },
  headerBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 20 },
  iconStack: { width: 20, height: 20 },
  iconAbsolute: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' },
  cancelText: { fontSize: 16, fontWeight: '600' },
  fastScrollerContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 80,
    zIndex: 100,
  },
  fastScrollTrack: {
    position: 'absolute',
    right: 20,
    top: 70,
    bottom: 140,
    width: 3,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 1.5,
  },
  fastScroller: {
    position: 'absolute',
    right: 0,
    height: 56,
    width: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  fastScrollThumb: {
    width: 44,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fastScrollThumbBar: {
    width: 4,
    height: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 2,
  },
  fastScrollLabel: {
    position: 'absolute',
    right: 48,
    minWidth: 64,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fastScrollDateText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  emptyText: { fontSize: 16 },
  emptyBtn: { borderRadius: 999, paddingHorizontal: 24, paddingVertical: 10 },
  emptyBtnText: { fontSize: 15, fontWeight: '600' },
  row: { flexDirection: 'row', overflow: 'hidden' },
  masonryRow: {
    flexDirection: 'row',
  },
  storyBlock: {
    position: 'relative',
    width: SCREEN_W,
    marginBottom: GAP,
    overflow: 'hidden',
  },
  storyTile: {
    position: 'absolute',
    overflow: 'hidden',
  },
  storyTileImage: {
    width: '100%',
    height: '100%',
  },
  storyTileSelected: {
    opacity: 0.72,
  },
  microYearBlock: {
    position: 'relative',
    width: SCREEN_W,
    overflow: 'hidden',
    backgroundColor: '#0B0D0C',
  },
  microTile: {
    position: 'absolute',
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.42)',
  },
  microYearPill: {
    position: 'absolute',
    left: 42,
    top: 18,
    height: 42,
    paddingHorizontal: 18,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.94)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 14,
    elevation: 6,
  },
  microYearText: {
    color: '#202724',
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  floatingDateTag: {
    position: 'absolute',
    top: 14,
    left: 14,
    height: 24,
    borderRadius: 999,
    paddingHorizontal: 11,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 4,
    backgroundColor: 'rgba(18,31,25,0.42)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.16)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 1,
  },
  floatingDateText: {
    color: 'rgba(255,255,255,0.82)',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  dateTag: {
    alignSelf: 'flex-start',
    height: 28,
    borderRadius: 999,
    paddingHorizontal: 14,
    marginVertical: 4,
    marginHorizontal: GAP / 2,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  dateTagText: { fontSize: 12, fontWeight: '700', letterSpacing: 0.2 },
});
