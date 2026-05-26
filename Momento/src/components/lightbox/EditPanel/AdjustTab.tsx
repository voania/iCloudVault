import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useMd3Theme } from '../../../theme';
import type { EditState } from '../../../types';

interface AdjustTabProps {
  edits: EditState;
  onChange: (patch: Partial<EditState>) => void;
}

interface AdjustmentDef {
  key: keyof EditState;
  label: string;
  min: number;
  max: number;
  step: number;
}

const ADJUSTMENTS: AdjustmentDef[] = [
  { key: 'brightness', label: '亮度', min: -100, max: 100, step: 5 },
  { key: 'contrast', label: '对比度', min: -100, max: 100, step: 5 },
  { key: 'saturation', label: '饱和度', min: -100, max: 100, step: 5 },
];

export function AdjustTab({ edits, onChange }: AdjustTabProps) {
  const theme = useMd3Theme();

  const adjustValue = (def: AdjustmentDef, delta: number) => {
    const current = edits[def.key] as number;
    const next = Math.min(def.max, Math.max(def.min, current + delta * def.step));
    onChange({ [def.key]: next });
  };

  return (
    <View style={styles.container}>
      {ADJUSTMENTS.map((def) => {
        const current = edits[def.key] as number;
        const pct = ((current - def.min) / (def.max - def.min)) * 100;
        return (
          <View key={def.key} style={styles.row}>
            <Text style={[styles.label, { color: theme.colors.onSurface }]}>{def.label}</Text>
            {/* 减按钮 */}
            <Pressable
              style={[styles.btn, { backgroundColor: theme.colors.surfaceVariant }]}
              onPress={() => adjustValue(def, -1)}
            >
              <Text style={[styles.btnText, { color: theme.colors.onSurface }]}>−</Text>
            </Pressable>
            {/* 进度条 */}
            <View style={[styles.barTrack, { backgroundColor: theme.colors.surfaceVariant }]}>
              <View
                style={[styles.barFill, { backgroundColor: theme.colors.primary, width: `${pct}%` }]}
              />
            </View>
            {/* 值 */}
            <Text style={[styles.value, { color: theme.colors.onSurface }]}>{current}</Text>
            {/* 加按钮 */}
            <Pressable
              style={[styles.btn, { backgroundColor: theme.colors.surfaceVariant }]}
              onPress={() => adjustValue(def, 1)}
            >
              <Text style={[styles.btnText, { color: theme.colors.onSurface }]}>+</Text>
            </Pressable>
            {/* 重置 */}
            <Pressable
              onPress={() => onChange({ [def.key]: 0 })}
            >
              <Text style={[styles.reset, { color: theme.colors.outline }]}>↺</Text>
            </Pressable>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 16 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  label: { fontSize: 14, width: 56, fontWeight: '500' },
  btn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: { fontSize: 18, fontWeight: '600' },
  barTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: { height: '100%', borderRadius: 3 },
  value: { fontSize: 13, fontWeight: '600', width: 36, textAlign: 'center' },
  reset: { fontSize: 16, padding: 4 },
});
