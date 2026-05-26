import React, { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  useWindowDimensions,
  Image,
  ActivityIndicator,
  type ListRenderItem,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  withTiming,
  interpolate,
  Extrapolate,
  type SharedValue,
  runOnJS,
} from 'react-native-reanimated';
import { StatusBar } from 'react-native';
import { usePhotoStore, useUiStore } from '../store';
import { useShare } from '../hooks/useShare';
import type { RootStackScreenProps } from '../navigation/types';
import { PhotoActionSheet } from '../components/overlays/PhotoActionSheet';
import { ExifEditor } from '../components/lightbox/ExifEditor';
import { LightboxImage } from '../components/lightbox/LightboxImage';
import { LineIcon } from '../components/shared/LineIcon';
import { LivePhotoPlayer } from '../components/photo/LivePhotoPlayer';
import { hapticSuccess, hapticWarning } from '../services/haptics';
import type { Photo } from '../types';

const THUMB_SLOT = 44;
const SCRUBBER_HORIZONTAL_PAD = 16;
const THUMB_BASE_WIDTH = 30;
const THUMB_BASE_HEIGHT = 30;

let VideoComponent: React.ComponentType<any> | null = null;
try {
  const mod = require('react-native-video');
  VideoComponent = mod.default || mod;
} catch {
  VideoComponent = null;
}

function formatTime(ms: number): string {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function formatDisplayDate(dateTaken: string, timeTaken: string): string {
  const d = new Date(dateTaken);
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  return `${year}年${month}月${day}日 ${timeTaken.slice(0, 5)}`;
}

const FilmstripThumb = React.memo(function FilmstripThumb({
  photo,
  index,
  scrollX,
  onPress,
}: {
  photo: Photo;
  index: number;
  scrollX: SharedValue<number>;
  onPress: () => void;
}) {
  const thumbAnim = useAnimatedStyle(() => {
    const centerIndex = scrollX.value / THUMB_SLOT;
    const distance = Math.abs(index - centerIndex);
    const scale = interpolate(distance, [0, 0.85, 1.8], [1.34, 1, 0.86], Extrapolate.CLAMP);
    const opacity = interpolate(distance, [0, 1, 2.2], [1, 0.82, 0.5], Extrapolate.CLAMP);
    const translateY = interpolate(distance, [0, 1.2], [-3, 3], Extrapolate.CLAMP);

    return {
      opacity,
      transform: [{ translateY }, { scale }],
    };
  });

  return (
    <Pressable onPress={onPress} style={s.thumbSlot} hitSlop={8}>
      <Animated.View style={[s.thumb, thumbAnim]}>
        <Image
          source={{ uri: photo.thumbnailUri || photo.uri, cache: 'force-cache' }}
          style={s.thumbImg}
          resizeMode="cover"
        />
        {photo.mediaType === 'video' ? (
          <View style={s.videoBadge}>
            <LineIcon name="play" size={9} color="#FFFFFF" />
          </View>
        ) : null}
      </Animated.View>
    </Pressable>
  );
});

export function LightboxScreen({ route, navigation }: RootStackScreenProps<'Lightbox'>) {
  const { photoId, photoIds } = route.params ?? {};
  const safePhotoIds = photoIds ?? [photoId ?? ''];
  const safePhotoId = photoId ?? safePhotoIds[0] ?? '';
  const insets = useSafeAreaInsets();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const updatePhoto = usePhotoStore((s) => s.updatePhoto);
  const showToast = useUiStore((s) => s.showToast);
  const photos = usePhotoStore((s) => s.photos);
  const { share: doShare } = useShare();

  const [isUiVisible, setIsUiVisible] = useState(true);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [showExifEditor, setShowExifEditor] = useState(false);
  const initialIndex = Math.max(safePhotoIds.indexOf(safePhotoId), 0);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [previewIndex, setPreviewIndex] = useState(initialIndex);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const scrubberRef = useRef<any>(null);
  const isScrubbingSv = useSharedValue(false);
  const scrubberCenterIndexSv = useSharedValue(initialIndex);
  const lastCenteredIndexRef = useRef(initialIndex);

  const uiOpacity = useSharedValue(1);
  const scrubberX = useSharedValue(initialIndex * THUMB_SLOT);

  const videoRef = useRef<any>(null);
  const videoSeekBarWidthRef = useRef(screenWidth - 32);
  const [videoPaused, setVideoPaused] = useState(false);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const videoSeekRatio = useSharedValue(0);
  const isSeekDragging = useSharedValue(false);

  useEffect(() => {
    uiOpacity.value = withTiming(isUiVisible ? 1 : 0, { duration: 250 });
  }, [isUiVisible]);

  const topAnim = useAnimatedStyle(() => ({
    opacity: uiOpacity.value,
    transform: [{ translateY: interpolate(uiOpacity.value, [0, 1], [-60, 0]) }],
  }));

  const bottomAnim = useAnimatedStyle(() => ({
    opacity: uiOpacity.value,
    transform: [{ translateY: interpolate(uiOpacity.value, [0, 1], [60, 0]) }],
  }));

  const photoMap = useMemo(() => {
    const m = new Map<string, Photo>();
    for (const p of photos) m.set(p.id, p);
    return m;
  }, [photos]);

  const currentPhotoId = safePhotoIds[currentIndex];
  const currentPhoto = photoMap.get(currentPhotoId);
  const previewPhotoId = safePhotoIds[previewIndex];
  const previewPhoto = photoMap.get(previewPhotoId);
  const photoList = useMemo(
    () => safePhotoIds.map((id) => photoMap.get(id)).filter(Boolean) as Photo[],
    [safePhotoIds, photoMap],
  );
  const scrubberSidePadding = Math.max(
    SCRUBBER_HORIZONTAL_PAD,
    screenWidth / 2 - THUMB_SLOT / 2,
  );
  const toggleUi = useCallback(() => {
    setIsUiVisible((v) => !v);
  }, []);

  const handleThumbPress = useCallback((index: number) => {
    isScrubbingSv.value = false;
    setIsScrubbing(false);
    lastCenteredIndexRef.current = index;
    setPreviewIndex(index);
    setCurrentIndex(index);
  }, [isScrubbingSv]);

  const commitCurrentFromScrubber = useCallback((index?: number) => {
    const idx = index ?? Math.round(scrubberX.value / THUMB_SLOT);
    const nextIndex = Math.min(Math.max(idx, 0), Math.max(photoList.length - 1, 0));
    if (lastCenteredIndexRef.current === nextIndex) return;
    lastCenteredIndexRef.current = nextIndex;
    setPreviewIndex(nextIndex);
    setCurrentIndex(nextIndex);
  }, [scrubberX, photoList.length]);

  const syncIndexFromScrubber = useCallback((idx: number) => {
    const nextIndex = Math.min(Math.max(idx, 0), Math.max(photoList.length - 1, 0));
    if (lastCenteredIndexRef.current !== nextIndex) {
      lastCenteredIndexRef.current = nextIndex;
      setPreviewIndex(nextIndex);
    }
  }, [photoList.length]);

  const startScrubbing = useCallback(() => {
    isScrubbingSv.value = true;
    scrubberCenterIndexSv.value = lastCenteredIndexRef.current;
    setPreviewIndex(lastCenteredIndexRef.current);
    setIsScrubbing(true);
  }, [isScrubbingSv, scrubberCenterIndexSv]);

  const endScrubbing = useCallback(() => {
    commitCurrentFromScrubber();
    requestAnimationFrame(() => {
      isScrubbingSv.value = false;
      setIsScrubbing(false);
    });
  }, [commitCurrentFromScrubber, isScrubbingSv]);

  const getScrubberItemLayout = useCallback(
    (_: ArrayLike<Photo> | null | undefined, index: number) => ({
      length: THUMB_SLOT,
      offset: THUMB_SLOT * index,
      index,
    }),
    [],
  );

  const renderScrubberItem = useCallback<ListRenderItem<Photo>>(
    ({ item, index }) => (
      <FilmstripThumb
        photo={item}
        index={index}
        scrollX={scrubberX}
        onPress={() => handleThumbPress(index)}
      />
    ),
    [handleThumbPress, scrubberX],
  );

  const scrubberScrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrubberX.value = event.contentOffset.x;
      if (isScrubbingSv.value) {
        const idx = Math.round(event.contentOffset.x / THUMB_SLOT);
        if (idx !== scrubberCenterIndexSv.value) {
          scrubberCenterIndexSv.value = idx;
          runOnJS(syncIndexFromScrubber)(idx);
        }
      }
    },
  });

  const handleFavorite = useCallback(() => {
    if (!currentPhoto) return;
    updatePhoto(currentPhoto.id, { isFavorite: !currentPhoto.isFavorite });
    showToast(currentPhoto.isFavorite ? '已取消收藏' : '已收藏', 'success');
    hapticSuccess();
  }, [currentPhoto, updatePhoto, showToast]);

  const handleDelete = useCallback(() => {
    if (!currentPhoto) return;
    updatePhoto(currentPhoto.id, { isDeleted: true, deletedAt: Date.now() });
    showToast('已移至回收站', 'info');
    hapticWarning();
    if (safePhotoIds.length <= 1) {
      navigation.goBack();
    }
  }, [currentPhoto, updatePhoto, showToast, safePhotoIds, navigation]);

  const handleShare = useCallback(() => {
    if (!currentPhoto) return;
    doShare(currentPhoto);
  }, [currentPhoto, doShare]);

  const handleEdit = useCallback(() => {
    if (!currentPhoto) return;
    navigation.navigate('EditPanel', { photoId: currentPhoto.id });
  }, [currentPhoto, navigation]);

  const handleComment = useCallback(() => {
    if (!currentPhoto) return;
    navigation.navigate('PhotoDetail', {
      photoId: currentPhoto.id,
      photoIds: safePhotoIds,
    });
  }, [currentPhoto, navigation, safePhotoIds]);

  const handleCompare = useCallback(() => {
    navigation.navigate('Compare', { photoId: currentPhotoId, photoIds: safePhotoIds });
  }, [currentPhotoId, safePhotoIds, navigation]);

  const handleVideoProgress = useCallback((data: { currentTime: number }) => {
    setVideoCurrentTime(data.currentTime * 1000);
  }, []);

  const handleVideoLoad = useCallback((data: { duration: number }) => {
    setVideoDuration(data.duration * 1000);
  }, []);

  const handleVideoEnd = useCallback(() => {
    setVideoPaused(true);
    setVideoCurrentTime(0);
    videoRef.current?.seek(0);
  }, []);

  const toggleVideoPause = useCallback(() => {
    setVideoPaused((p) => !p);
  }, []);

  const commitVideoSeek = useCallback((ratio: number) => {
    const ms = ratio * videoDuration;
    videoRef.current?.seek(ms / 1000);
    setVideoCurrentTime(ms);
  }, [videoDuration]);

  const videoSeekGesture = useMemo(() =>
    Gesture.Pan()
      .onStart((event) => {
        isSeekDragging.value = true;
        const x = event.x;
        const w = videoSeekBarWidthRef.current;
        const ratio = Math.min(1, Math.max(0, x / w));
        videoSeekRatio.value = ratio;
      })
      .onUpdate((event) => {
        const x = event.x;
        const w = videoSeekBarWidthRef.current;
        const ratio = Math.min(1, Math.max(0, x / w));
        videoSeekRatio.value = ratio;
      })
      .onEnd((event) => {
        isSeekDragging.value = false;
        const x = event.x;
        const w = videoSeekBarWidthRef.current;
        const ratio = Math.min(1, Math.max(0, x / w));
        runOnJS(commitVideoSeek)(ratio);
      })
  , [commitVideoSeek, isSeekDragging, videoSeekRatio]);

  const videoSeekProgressStyle = useAnimatedStyle(() => ({
    width: `${videoSeekRatio.value * 100}%`,
  }));

  const videoSeekThumbStyle = useAnimatedStyle(() => ({
    left: `${videoSeekRatio.value * 100}%`,
  }));

  const goToPrev = useCallback(() => {
    setCurrentIndex((i) => Math.max(0, i - 1));
  }, []);

  const goToNext = useCallback(() => {
    setCurrentIndex((i) => Math.min(photoList.length - 1, i + 1));
  }, [photoList.length]);

  const handleDismiss = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  useEffect(() => {
    if (scrubberRef.current && photoList.length > 0 && !isScrubbingSv.value) {
      const offset = currentIndex * THUMB_SLOT;
      lastCenteredIndexRef.current = currentIndex;
      scrubberRef.current.scrollToOffset({ offset: Math.max(0, offset), animated: true });
    }
    setVideoPaused(false);
    setVideoCurrentTime(0);
    setVideoDuration(0);
    videoSeekRatio.value = 0;
  }, [currentIndex, photoList.length, isScrubbingSv, videoSeekRatio]);

  useEffect(() => {
    if (!isSeekDragging.value && videoDuration > 0) {
      videoSeekRatio.value = videoCurrentTime / videoDuration;
    }
  }, [videoCurrentTime, videoDuration, isSeekDragging, videoSeekRatio]);

  if (photoList.length === 0) {
    return (
      <View style={s.root}>
        <Pressable
          style={{ marginTop: insets.top + 12, marginLeft: 16, padding: 12 }}
          onPress={() => navigation.goBack()}
        >
          <LineIcon name="chevron-left" size={24} color="#FFFFFF" />
        </Pressable>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#FFFFFF', fontSize: 16 }}>照片不存在</Text>
        </View>
      </View>
    );
  }

  const displayIndex = isScrubbing ? previewIndex : currentIndex;
  const displayPhoto = isScrubbing ? previewPhoto : currentPhoto;
  const locationText = displayPhoto?.locationName ?? '';
  const dateTimeText = displayPhoto
    ? formatDisplayDate(displayPhoto.dateTaken, displayPhoto.timeTaken)
    : '';
  const scrubPreviewUri = previewPhoto?.thumbnailUri || previewPhoto?.uri || '';

  return (
    <View style={s.root}>
      {/* 主图区域：三路分支 — 照片 / 视频 / 实况 */}
      {displayPhoto && isScrubbing ? (
        <Pressable
          onPress={toggleUi}
          style={{ width: screenWidth, height: screenHeight, backgroundColor: '#000000', justifyContent: 'center' }}
        >
          {scrubPreviewUri ? (
            <Image
              source={{ uri: scrubPreviewUri, cache: 'force-cache' }}
              style={{ width: screenWidth, height: screenHeight }}
              resizeMode="contain"
              fadeDuration={0}
              resizeMethod="resize"
            />
          ) : (
            <ActivityIndicator size="large" color="rgba(255,255,255,0.6)" />
          )}
        </Pressable>
      ) : displayPhoto && displayPhoto.mediaType === 'live' ? (
        <LivePhotoPlayer
          photo={displayPhoto}
          width={screenWidth}
          height={screenHeight}
        />
      ) : displayPhoto && displayPhoto.mediaType === 'video' && VideoComponent ? (
        <Pressable
          onPress={toggleUi}
          style={{ width: screenWidth, height: screenHeight, backgroundColor: '#000000' }}
        >
          <VideoComponent
            key={displayPhoto.id}
            ref={videoRef}
            source={{ uri: displayPhoto.uri }}
            style={{ width: screenWidth, height: screenHeight }}
            resizeMode="contain"
            paused={videoPaused}
            onProgress={handleVideoProgress}
            onLoad={handleVideoLoad}
            onEnd={handleVideoEnd}
            repeat={false}
          />
          {videoPaused && (
            <View style={videoStyles.playOverlay}>
              <Pressable onPress={toggleVideoPause} style={videoStyles.playCircle}>
                <LineIcon name="play" size={32} color="#FFFFFF" />
              </Pressable>
            </View>
          )}
          {!isUiVisible && !videoPaused && (
            <Pressable style={videoStyles.tapOverlay} onPress={toggleUi} />
          )}
        </Pressable>
      ) : displayPhoto ? (
        <LightboxImage
          key={displayPhoto.id}
          id={displayPhoto.id}
          uri={displayPhoto.uri || displayPhoto.thumbnailUri || ''}
          color={displayPhoto.color || '#000000'}
          onTap={toggleUi}
          onRequestClose={handleDismiss}
          onPrev={currentIndex > 0 ? goToPrev : undefined}
          onNext={currentIndex < photoList.length - 1 ? goToNext : undefined}
        />
      ) : (
        <View style={{ width: screenWidth, height: screenHeight, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000000' }}>
          <ActivityIndicator size="large" color="rgba(255,255,255,0.6)" />
        </View>
      )}

      <Animated.View style={[s.topBar, { paddingTop: insets.top + 8 }, topAnim]} pointerEvents={isUiVisible ? 'auto' : 'none'}>
        <View style={s.topLeft}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={12} style={s.backArrow}>
            <LineIcon name="chevron-left" size={24} color="#FFFFFF" />
          </Pressable>
          <View style={s.topTextWrap}>
            {locationText ? (
              <Text style={s.locationText} numberOfLines={1}>{locationText}</Text>
            ) : null}
            <Text style={s.dateTimeText} numberOfLines={1}>{dateTimeText}</Text>
          </View>
        </View>
        <Pressable onPress={() => setShowActionSheet(true)} hitSlop={12} style={s.moreBtn}>
          <LineIcon name="settings" size={22} color="#FFFFFF" />
        </Pressable>
      </Animated.View>

      <Animated.View style={[s.bottomWrap, { paddingBottom: insets.bottom + 8 }, bottomAnim]} pointerEvents={isUiVisible ? 'auto' : 'none'}>
        {!isScrubbing && currentPhoto?.mediaType === 'video' && (
          <View style={s.videoControlBar}>
            <GestureDetector gesture={videoSeekGesture}>
              <View
                style={s.videoSeekTrack}
                onLayout={(e) => { videoSeekBarWidthRef.current = e.nativeEvent.layout.width; }}
              >
                <Animated.View style={[s.videoSeekProgress, videoSeekProgressStyle]} />
                <Animated.View style={[s.videoSeekThumb, videoSeekThumbStyle]} />
              </View>
            </GestureDetector>
            <View style={s.videoCtrlRow}>
              <Pressable onPress={toggleVideoPause} style={s.videoCtrlBtn}>
                <LineIcon name={videoPaused ? 'play' : 'pause'} size={16} color="#FFFFFF" />
              </Pressable>
              <Text style={s.videoTime}>
                {formatTime(videoCurrentTime)} / {formatTime(videoDuration)}
              </Text>
            </View>
          </View>
        )}

        <View style={s.scrubberShell}>
          <Animated.FlatList
            ref={scrubberRef}
            data={photoList}
            renderItem={renderScrubberItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={s.scrubber}
            contentContainerStyle={[
              s.scrubberContent,
              { paddingLeft: scrubberSidePadding, paddingRight: scrubberSidePadding },
            ]}
            onScroll={scrubberScrollHandler}
            scrollEventThrottle={8}
            decelerationRate={0.98}
            getItemLayout={getScrubberItemLayout}
            initialScrollIndex={initialIndex}
            initialNumToRender={20}
            maxToRenderPerBatch={10}
            updateCellsBatchingPeriod={16}
            windowSize={5}
            removeClippedSubviews
            onScrollBeginDrag={startScrubbing}
            onMomentumScrollBegin={startScrubbing}
            onMomentumScrollEnd={endScrubbing}
            onScrollEndDrag={endScrubbing}
            onScrollToIndexFailed={(info) => {
              scrubberRef.current?.scrollToOffset({
                offset: info.averageItemLength * info.index,
                animated: false,
              });
            }}
          />
          <View pointerEvents="none" style={s.centerTick} />
        </View>

        <View style={s.mediaCountPill} pointerEvents="none">
          <Text style={s.mediaCountText}>
            {displayIndex + 1} / {photoList.length}
          </Text>
        </View>

        <View style={s.actionBar}>
          <Pressable onPress={handleShare} style={s.actionBtn}>
            <LineIcon name="share" size={22} color="#FFFFFF" />
          </Pressable>
          <Pressable onPress={handleFavorite} style={s.actionBtn}>
            <LineIcon
              name={currentPhoto?.isFavorite ? 'heart-filled' : 'heart'}
              size={22}
              color={currentPhoto?.isFavorite ? '#FF6B8A' : '#FFFFFF'}
            />
          </Pressable>
          <Pressable onPress={handleComment} style={s.actionBtn}>
            <LineIcon name="message" size={22} color="#FFFFFF" />
          </Pressable>
          <Pressable onPress={handleEdit} style={s.actionBtn}>
            <LineIcon name="pencil" size={22} color="#FFFFFF" />
          </Pressable>
          <Pressable onPress={handleDelete} style={s.actionBtn}>
            <LineIcon name="trash" size={22} color="#FFFFFF" />
          </Pressable>
          <Pressable onPress={() => setShowExifEditor(true)} style={s.actionBtn}>
            <LineIcon name="info" size={22} color="#FFFFFF" />
          </Pressable>
        </View>
      </Animated.View>

      <PhotoActionSheet
        visible={showActionSheet}
        photo={currentPhoto ?? null}
        onClose={() => setShowActionSheet(false)}
        onEdit={handleEdit}
        onCompare={handleCompare}
        onExifEdit={() => {
          setShowActionSheet(false);
          setShowExifEditor(true);
        }}
      />
      {currentPhoto && (
        <ExifEditor
          visible={showExifEditor}
          photoId={currentPhoto.id}
          exif={currentPhoto.exif}
          onClose={() => setShowExifEditor(false)}
        />
      )}
    </View>
  );
}

const videoStyles = StyleSheet.create({
  tapOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  playOverlay: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  playCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 4,
  },
  durationText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
  },
});

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000000',
  },
  topBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 12,
    zIndex: 20,
  },
  topLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  backArrow: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topTextWrap: {
    justifyContent: 'center',
    paddingTop: 6,
    flexShrink: 1,
  },
  locationText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 18,
  },
  dateTimeText: {
    color: '#AAAAAA',
    fontSize: 11,
    fontWeight: '300',
    lineHeight: 16,
  },
  moreBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 20,
  },
  scrubberShell: {
    height: 52,
    justifyContent: 'center',
  },
  scrubber: {
    maxHeight: 52,
  },
  scrubberContent: {
    height: 52,
    alignItems: 'center',
  },
  thumbSlot: {
    width: THUMB_SLOT,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumb: {
    width: THUMB_BASE_WIDTH,
    height: THUMB_BASE_HEIGHT,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  thumbImg: {
    width: '100%',
    height: '100%',
  },
  videoBadge: {
    position: 'absolute',
    right: 4,
    bottom: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 1,
  },
  centerTick: {
    position: 'absolute',
    left: '50%',
    top: 2,
    width: 3,
    height: 46,
    marginLeft: -1.5,
    borderRadius: 1.5,
    backgroundColor: 'rgba(255,255,255,0.95)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  videoControlBar: {
    marginHorizontal: 16,
    marginBottom: 6,
  },
  videoSeekTrack: {
    height: 32,
    justifyContent: 'center',
  },
  videoSeekProgress: {
    position: 'absolute',
    height: 3,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
  },
  videoSeekThumb: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#FFFFFF',
    marginLeft: -7,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  videoCtrlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  videoCtrlBtn: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  videoTime: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
    fontWeight: '500',
    fontVariant: ['tabular-nums'],
  },
  mediaCountPill: {
    alignSelf: 'center',
    marginTop: 7,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.36)',
  },
  mediaCountText: {
    color: 'rgba(255,255,255,0.76)',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  actionBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
});
