import React, { useEffect, useRef } from 'react';
import { Animated, Easing, type ViewStyle } from 'react-native';

// ============================================================
// StaggeredEntrance — 交错入场动画
// 子元素逐个弹出（缩放+淡入），间隔 staggerMs
// 用于照片网格首次加载时的入场效果
// ============================================================

interface StaggeredEntranceProps {
  children: React.ReactNode;
  index: number;
  staggerMs?: number;
  duration?: number;
  style?: ViewStyle;
}

export function StaggeredEntrance({
  children,
  index,
  staggerMs = 60,
  duration = 350,
  style,
}: StaggeredEntranceProps) {
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const delay = index * staggerMs;

    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        delay,
        duration,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        delay,
        duration: duration * 0.7,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, [index]);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity: opacityAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}

// 列表级包装器：为子元素自动分配 index
interface StaggeredListProps {
  children: React.ReactNode[];
  staggerMs?: number;
  duration?: number;
  initialDelay?: number;
}

export function StaggeredList({
  children,
  staggerMs = 50,
  duration = 350,
  initialDelay = 80,
}: StaggeredListProps) {
  // 为每个子元素添加一个 wrapper（通过 key 注入 index）
  // 实际使用中通过 renderItem 传入 index
  return (
    <>
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          return (
            <StaggeredEntrance
              index={index}
              staggerMs={staggerMs}
              duration={duration}
              key={index}
            >
              {child}
            </StaggeredEntrance>
          );
        }
        return child;
      })}
    </>
  );
}
