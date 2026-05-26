import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  TextInput,
  ScrollView,
} from 'react-native';
import { useMd3Theme } from '../../theme';
import { useAlbumStore, useUiStore } from '../../store';
import { CATEGORY_LABELS } from '../../utils/constants';
import type { SmartAlbumRule, Category } from '../../types';

interface SmartAlbumDialogProps {
  visible: boolean;
  onClose: () => void;
}

const CATEGORY_OPTIONS: Category[] = ['person', 'landscape', 'document', 'pet', 'food', 'object'];

export function SmartAlbumDialog({ visible, onClose }: SmartAlbumDialogProps) {
  const theme = useMd3Theme();
  const createSmartAlbum = useAlbumStore((s) => s.createSmartAlbum);
  const showToast = useUiStore((s) => s.showToast);
  const [name, setName] = useState('');
  const [selectedCat, setSelectedCat] = useState<Category | null>(null);

  const handleCreate = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      showToast('请输入相册名称', 'warning');
      return;
    }
    if (!selectedCat) {
      showToast('请选择分类规则', 'warning');
      return;
    }
    const rules: SmartAlbumRule[] = [
      { field: 'category', operator: 'equals', value: selectedCat },
    ];
    createSmartAlbum(trimmed, rules);
    showToast('智能相册已创建', 'success');
    setName('');
    setSelectedCat(null);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.title, { color: theme.colors.onSurface }]}>新建智能相册</Text>
          <Text style={[styles.hint, { color: theme.colors.onSurfaceVariant }]}>
            选择分类规则，符合条件的照片自动加入
          </Text>

          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.colors.surfaceVariant,
                color: theme.colors.onSurface,
              },
            ]}
            placeholder="相册名称"
            placeholderTextColor={theme.colors.onSurfaceVariant}
            value={name}
            onChangeText={setName}
            maxLength={30}
          />

          <Text style={[styles.ruleLabel, { color: theme.colors.onSurface }]}>选择分类</Text>
          <View style={styles.chipRow}>
            {CATEGORY_OPTIONS.map((cat) => (
              <Pressable
                key={cat}
                style={[
                  styles.chip,
                  {
                    backgroundColor:
                      selectedCat === cat
                        ? theme.colors.primaryContainer
                        : theme.colors.surfaceVariant,
                  },
                ]}
                onPress={() => setSelectedCat(cat)}
              >
                <Text
                  style={[
                    styles.chipText,
                    {
                      color:
                        selectedCat === cat
                          ? theme.colors.onPrimaryContainer
                          : theme.colors.onSurfaceVariant,
                    },
                  ]}
                >
                  {CATEGORY_LABELS[cat]}
                </Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.actions}>
            <Pressable
              style={[styles.btn, { backgroundColor: theme.colors.surfaceVariant }]}
              onPress={onClose}
            >
              <Text style={[styles.btnText, { color: theme.colors.onSurface }]}>取消</Text>
            </Pressable>
            <Pressable
              style={[styles.btn, { backgroundColor: theme.colors.primary }]}
              onPress={handleCreate}
            >
              <Text style={[styles.btnText, { color: theme.colors.onPrimary }]}>创建</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000088',
    padding: 24,
  },
  card: {
    width: '100%',
    borderRadius: 24,
    padding: 24,
    maxHeight: '80%',
  },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 6 },
  hint: { fontSize: 13, marginBottom: 16, lineHeight: 18 },
  input: {
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    marginBottom: 16,
  },
  ruleLabel: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 16 },
  chipText: { fontSize: 13, fontWeight: '600' },
  actions: { flexDirection: 'row', gap: 12 },
  btn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  btnText: { fontSize: 15, fontWeight: '600' },
});
