import React, { useRef, useEffect } from 'react';
import { Animated, View, type ViewStyle } from 'react-native';

// ============================================================
// FlipLayout — FLIP (First Last Invert Play) 动画包装器
// 当 gridColumns 改变时，计算位置差异并播放过渡动画
// 用于 PhotoGrid 列数切换时的平滑过渡
// ============================================================

interface Rect {
  x: number; y: number; w: number; h: number;
}

interface FlipLayoutProps {
  children: React.ReactNode;
  itemKey: string;
  columnCount: number;
  gap: number;
  containerWidth: number;
  style?: ViewStyle;
}

// 存储每个 item 的上一帧位置
const layoutCache = new Map<string, Rect>();

export function FlipLayout({
  children,
  itemKey,
  columnCount,
  gap,
  containerWidth,
  style,
}: FlipLayoutProps) {
  const animRef = useRef(new Animated.Value(1)).current;
  const posRef = useRef({ x: 0, y: 0 });
  const viewRef = useRef<View>(null);

  // 计算当前 item 应在的位置
  const index = parseInt(itemKey.split('-').pop() || '0', 10);
  const col = index % columnCount;
  const row = Math.floor(index / columnCount);
  const cardSize = (containerWidth - gap * (columnCount - 1)) / columnCount;
  const currentX = col * (cardSize + gap);
  const currentY = row * (cardSize + gap);

  const prevLayout = layoutCache.get(itemKey);

  useEffect(() => {
    if (prevLayout) {
      // FLIP: First — 记录旧位置（已缓存）
      // Last — 当前实际位置
      // Invert — 计算差值
      const dx = prevLayout.x - currentX;
      const dy = prevLayout.y - currentY;

      if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
        // 设置初始偏移（Invert）
        animRef.setValue(0);

        // Play — 动画到目标位置
        Animated.spring(animRef, {
          toValue: 1,
          friction: 12,
          tension: 80,
          useNativeDriver: true,
        }).start();
      }
    }

    // 更新缓存
    layoutCache.set(itemKey, { x: currentX, y: currentY, w: cardSize, h: cardSize });
  }, [columnCount, cardSize, currentX, currentY]);

  const translateX = animRef.interpolate({
    inputRange: [0, 1],
    outputRange: [prevLayout ? prevLayout.x - currentX : 0, 0],
  });

  const translateY = animRef.interpolate({
    inputRange: [0, 1],
    outputRange: [prevLayout ? prevLayout.y - currentY : 0, 0],
  });

  return (
    <Animated.View
      ref={viewRef as any}
      style={[
        style,
        {
          transform: [{ translateX }, { translateY }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}

// 清除缓存的工具函数
export function clearFlipCache() {
  layoutCache.clear();
}
