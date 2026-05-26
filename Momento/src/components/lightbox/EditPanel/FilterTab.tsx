import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useMd3Theme } from '../../../theme';

interface FilterTabProps {
  currentFilter: string | null;
  onSelect: (filter: string | null) => void;
}

const FILTERS = [
  { id: null, name: '原图', color: 'transparent' },
  { id: 'warm', name: '暖色', color: '#FF9800' },
  { id: 'cool', name: '冷色', color: '#2196F3' },
  { id: 'bw', name: '黑白', color: '#424242' },
  { id: 'vivid', name: '鲜艳', color: '#E91E63' },
  { id: 'fade', name: '褪色', color: '#9E9E9E' },
  { id: 'vintage', name: '复古', color: '#795548' },
  { id: 'dramatic', name: '戏剧', color: '#3F51B5' },
];

export function FilterTab({ currentFilter, onSelect }: FilterTabProps) {
  const theme = useMd3Theme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {FILTERS.map((f) => (
        <Pressable
          key={f.id ?? 'original'}
          style={[
            styles.chip,
            {
              backgroundColor:
                currentFilter === f.id ? theme.colors.primaryContainer : theme.colors.surfaceVariant,
              borderColor:
                currentFilter === f.id ? theme.colors.primary : 'transparent',
            },
          ]}
          onPress={() => onSelect(f.id)}
        >
          <View style={[styles.swatch, { backgroundColor: f.color || theme.colors.outline }]} />
          <Text
            style={[
              styles.name,
              {
                color:
                  currentFilter === f.id
                    ? theme.colors.onPrimaryContainer
                    : theme.colors.onSurfaceVariant,
              },
            ]}
          >
            {f.name}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 10 },
  chip: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 16,
    borderWidth: 1.5,
    minWidth: 64,
  },
  swatch: { width: 36, height: 36, borderRadius: 18, marginBottom: 6 },
  name: { fontSize: 12, fontWeight: '600' },
});
