import React, { useState, useCallback } from 'react';
import {
  RefreshControl,
  ScrollView,
  type RefreshControlProps,
} from 'react-native';
import { useMd3Theme } from '../../theme';

// ============================================================
// PullToRefresh — 下拉刷新包装器
// 接受 onRefresh 回调，显示 MD3 风格刷新指示器
// 用于包裹 ScrollView / FlatList
// ============================================================

interface PullToRefreshProps {
  onRefresh: () => Promise<void> | void;
  children: React.ReactNode;
  enabled?: boolean;
  scrollView?: boolean;
}

export function PullToRefresh({ onRefresh, children, enabled = true, scrollView = false }: PullToRefreshProps) {
  const theme = useMd3Theme();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setRefreshing(false);
    }
  }, [onRefresh]);

  const refreshControl = (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={handleRefresh}
      enabled={enabled}
      tintColor={theme.colors.primary}
      colors={[theme.colors.primary, theme.colors.tertiary]}
      progressBackgroundColor={theme.colors.surface}
    />
  );

  if (scrollView) {
    return (
      <ScrollView refreshControl={refreshControl} style={{ flex: 1 }}>
        {children}
      </ScrollView>
    );
  }

  // 非 ScrollView 模式：通过 cloneElement 或直接返回
  // 实际使用中由 FlatList/ScrollView 自行设置 refreshControl
  return <>{children}</>;
}

// Hook 版本：方便在 FlatList 中使用
export function usePullToRefresh(onRefresh: () => Promise<void> | void) {
  const theme = useMd3Theme();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setRefreshing(false);
    }
  }, [onRefresh]);

  const refreshControl = (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={handleRefresh}
      tintColor={theme.colors.primary}
      colors={[theme.colors.primary, theme.colors.tertiary]}
      progressBackgroundColor={theme.colors.surface}
    />
  );

  return { refreshing, refreshControl };
}
