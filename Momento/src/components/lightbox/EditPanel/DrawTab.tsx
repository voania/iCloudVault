import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useMd3Theme } from '../../../theme';

interface DrawTabProps {
  onSaveAnnotation: () => void;
  onClear: () => void;
}

const COLORS = ['#FF0000', '#FF9800', '#FFEB3B', '#4CAF50', '#2196F3', '#9C27B0', '#000000', '#FFFFFF'];
const SIZES = [2, 4, 6, 8];

export function DrawTab({ onSaveAnnotation, onClear }: DrawTabProps) {
  const theme = useMd3Theme();
  const [activeColor, setActiveColor] = React.useState(COLORS[0]);
  const [activeSize, setActiveSize] = React.useState(SIZES[1]);

  return (
    <View style={styles.container}>
      {/* 颜色选择 */}
      <Text style={[styles.label, { color: theme.colors.onSurface }]}>颜色</Text>
      <View style={styles.row}>
        {COLORS.map((c) => (
          <Pressable
            key={c}
            style={[
              styles.colorBtn,
              {
                backgroundColor: c,
                borderColor: activeColor === c ? theme.colors.primary : 'transparent',
                borderWidth: activeColor === c ? 2.5 : 0,
              },
            ]}
            onPress={() => setActiveColor(c)}
          />
        ))}
      </View>

      {/* 笔触大小 */}
      <Text style={[styles.label, { color: theme.colors.onSurface, marginTop: 16 }]}>笔触</Text>
      <View style={styles.row}>
        {SIZES.map((s) => (
          <Pressable
            key={s}
            style={[
              styles.sizeBtn,
              {
                backgroundColor:
                  activeSize === s ? theme.colors.primaryContainer : theme.colors.surfaceVariant,
              },
            ]}
            onPress={() => setActiveSize(s)}
          >
            <View
              style={[styles.sizeDot, { width: s * 2, height: s * 2, borderRadius: s }]}
            />
          </Pressable>
        ))}
      </View>

      {/* 操作按钮 */}
      <View style={[styles.actions, { marginTop: 24 }]}>
        <Pressable
          style={[styles.actionBtn, { backgroundColor: theme.colors.surfaceVariant }]}
          onPress={onClear}
        >
          <Text style={[styles.actionText, { color: theme.colors.onSurface }]}>清除</Text>
        </Pressable>
        <Pressable
          style={[styles.actionBtn, { backgroundColor: theme.colors.primary }]}
          onPress={onSaveAnnotation}
        >
          <Text style={[styles.actionText, { color: theme.colors.onPrimary }]}>保存标注</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 8 },
  row: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', alignItems: 'center' },
  colorBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  sizeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sizeDot: {
    backgroundColor: '#000',
  },
  actions: { flexDirection: 'row', gap: 12 },
  actionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionText: { fontSize: 14, fontWeight: '600' },
});
