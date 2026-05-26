import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useMd3Theme } from '../../../theme';
import type { CropRect } from '../../../types';

interface CropTabProps {
  crop: CropRect | null;
  onCrop: (crop: CropRect | null) => void;
  onRotate: () => void;
  rotation: number;
}

const ASPECT_RATIOS = [
  { label: '自由', w: 0, h: 0 },
  { label: '1:1', w: 1, h: 1 },
  { label: '4:3', w: 4, h: 3 },
  { label: '16:9', w: 16, h: 9 },
  { label: '3:2', w: 3, h: 2 },
];

export function CropTab({ crop, onCrop, onRotate, rotation }: CropTabProps) {
  const theme = useMd3Theme();

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionLabel, { color: theme.colors.onSurface }]}>宽高比</Text>
      <View style={styles.row}>
        {ASPECT_RATIOS.map((ratio) => (
          <Pressable
            key={ratio.label}
            style={[
              styles.btn,
              { backgroundColor: theme.colors.surfaceVariant },
            ]}
            onPress={() => {
              if (ratio.w === 0) {
                onCrop(null);
              } else {
                onCrop({ x: 0, y: 0, width: ratio.w, height: ratio.h });
              }
            }}
          >
            <Text style={[styles.btnText, { color: theme.colors.onSurface }]}>
              {ratio.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={[styles.sectionLabel, { color: theme.colors.onSurface, marginTop: 20 }]}>
        旋转
      </Text>
      <View style={styles.row}>
        <Pressable
          style={[styles.btn, { backgroundColor: theme.colors.surfaceVariant }]}
          onPress={onRotate}
        >
          <Text style={[styles.btnText, { color: theme.colors.onSurface }]}>
            ↻ 90°
          </Text>
        </Pressable>
        <Text style={[styles.rotationVal, { color: theme.colors.onSurfaceVariant }]}>
          当前: {rotation}°
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  sectionLabel: { fontSize: 14, fontWeight: '600', marginBottom: 10 },
  row: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', alignItems: 'center' },
  btn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  btnText: { fontSize: 14, fontWeight: '500' },
  rotationVal: { fontSize: 13, marginLeft: 8 },
});
