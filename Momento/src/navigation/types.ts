import type { NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { RootStackParamList, MainTabParamList } from '../types';

// 复用 types/index.ts 中的 ParamList，这里只定义 screen props 工具类型

// Root Stack
export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

// Tab
export type TabScreenProps<T extends keyof MainTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<MainTabParamList, T>,
    NativeStackScreenProps<RootStackParamList, 'Main'>
  >;

// Lightbox screen（接收 route params）
export type LightboxScreenProps = NativeStackScreenProps<RootStackParamList, 'Lightbox'>;
export type AlbumDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'AlbumDetail'>;
export type EditPanelScreenProps = NativeStackScreenProps<RootStackParamList, 'EditPanel'>;
