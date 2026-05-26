import {
  launchImageLibrary,
  launchCamera,
} from 'react-native-image-picker';
import { PermissionsAndroid, Platform, Linking, Alert } from 'react-native';
import type { Asset } from 'react-native-image-picker';
import type { IPhotoPicker, PickedImage, PickerOptions, AlbumInfo } from './types';

function mapAsset(asset: Asset): PickedImage {
  const isVideo = asset.type?.startsWith('video/') ?? false;
  const filename = asset.fileName || (isVideo ? `VID_${Date.now()}.mp4` : `IMG_${Date.now()}.jpg`);

  return {
    uri: asset.uri ?? '',
    filename,
    width: asset.width ?? 0,
    height: asset.height ?? 0,
    sizeBytes: asset.fileSize ?? 0,
    type: asset.type ?? (isVideo ? 'video/mp4' : 'image/jpeg'),
    duration: asset.duration ? asset.duration * 1000 : undefined,
    exif: (asset as Record<string, unknown>).exif as Record<string, unknown> | undefined,
    latitude: (asset as Record<string, unknown>).latitude as number | undefined,
    longitude: (asset as Record<string, unknown>).longitude as number | undefined,
    timestamp: asset.timestamp ? new Date(asset.timestamp).getTime() : undefined,
    albumName: (asset as Record<string, unknown>).albumName as string | undefined,
  };
}

async function requestCameraPermission(): Promise<boolean> {
  if (Platform.OS !== 'android') return true;

  const check = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);
  if (check) return true;

  const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
    title: '相机权限',
    message: 'Momento 需要相机权限来拍照',
    buttonNeutral: '稍后询问',
    buttonNegative: '拒绝',
    buttonPositive: '允许',
  });

  if (result === PermissionsAndroid.RESULTS.GRANTED) return true;

  if (result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
    Alert.alert(
      '需要相机权限',
      '请在系统设置中为 Momento 开启相机权限',
      [
        { text: '取消', style: 'cancel' },
        { text: '去设置', onPress: () => Linking.openSettings() },
      ],
    );
  }

  return false;
}

async function requestStoragePermission(): Promise<boolean> {
  if (Platform.OS !== 'android') return true;
  // Android 10 (API 29)+ uses scoped storage, no write permission needed
  if ((Platform.Version as number) >= 29) return true;

  const check = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
  );
  if (check) return true;

  const result = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    {
      title: '存储权限',
      message: 'Momento 需要存储权限来保存照片',
      buttonNeutral: '稍后询问',
      buttonNegative: '拒绝',
      buttonPositive: '允许',
    },
  );

  if (result === PermissionsAndroid.RESULTS.GRANTED) return true;

  if (result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
    Alert.alert(
      '需要存储权限',
      '请在系统设置中为 Momento 开启存储权限',
      [
        { text: '取消', style: 'cancel' },
        { text: '去设置', onPress: () => Linking.openSettings() },
      ],
    );
  }

  return false;
}

export class ImagePickerAdapter implements IPhotoPicker {
  async getAlbums(): Promise<AlbumInfo[]> {
    return [];
  }

  async pickFromGallery(options?: PickerOptions): Promise<PickedImage[]> {
    const mediaType = options?.mediaType ?? 'mixed';

    const response = await launchImageLibrary({
      mediaType,
      selectionLimit: options?.multiple ? (options.maxFiles ?? 50) : 1,
      quality: 0.8,
      includeBase64: false,
      includeExtra: true,
      videoQuality: 'high',
    });

    if (response.didCancel || response.errorCode) {
      return [];
    }

    return (response.assets ?? []).map(mapAsset);
  }

  async pickFromAlbum(albumId: string, options?: PickerOptions): Promise<PickedImage[]> {
    const mediaType = options?.mediaType ?? 'mixed';

    const response = await launchImageLibrary({
      mediaType,
      selectionLimit: options?.multiple ? (options.maxFiles ?? 50) : 1,
      quality: 0.8,
      includeBase64: false,
      includeExtra: true,
      videoQuality: 'high',
    });

    if (response.didCancel || response.errorCode) {
      return [];
    }

    return (response.assets ?? []).map(mapAsset);
  }

  async importAllFromAlbum(albumId: string, options?: PickerOptions): Promise<PickedImage[]> {
    return this.pickFromAlbum(albumId, options);
  }

  async pickFromCamera(options?: PickerOptions): Promise<PickedImage[]> {
    const hasCameraPermission = await requestCameraPermission();
    if (!hasCameraPermission) return [];

    const hasStoragePermission = await requestStoragePermission();
    if (!hasStoragePermission) return [];

    const response = await launchCamera({
      mediaType: options?.mediaType ?? 'photo',
      quality: 0.9,
      includeBase64: false,
      includeExtra: true,
      saveToPhotos: true,
      videoQuality: 'high',
    });

    if (response.didCancel || response.errorCode) {
      if (response.errorCode === 'camera_unavailable') {
        Alert.alert('无法打开相机', '设备上没有可用的相机');
      } else if (response.errorCode === 'permission') {
        Alert.alert('权限被拒绝', '请允许 Momento 访问相机');
      }
      return [];
    }

    return (response.assets ?? []).map(mapAsset);
  }

  async getAllPhotos(options?: PickerOptions): Promise<PickedImage[]> {
    return this.pickFromGallery({ multiple: true, ...options });
  }
}
