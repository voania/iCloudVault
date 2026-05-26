import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  TextInput,
} from 'react-native';
import { useMd3Theme } from '../../theme';
import { useAlbumStore, useUiStore } from '../../store';

interface AlbumCreateDialogProps {
  visible: boolean;
  onClose: () => void;
}

export function AlbumCreateDialog({ visible, onClose }: AlbumCreateDialogProps) {
  const theme = useMd3Theme();
  const createAlbum = useAlbumStore((s) => s.createAlbum);
  const showToast = useUiStore((s) => s.showToast);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleCreate = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      showToast('请输入相册名称', 'warning');
      return;
    }
    createAlbum(trimmed, description.trim());
    showToast('相册已创建', 'success');
    setName('');
    setDescription('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.title, { color: theme.colors.onSurface }]}>新建相册</Text>

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
            autoFocus
            maxLength={30}
          />

          <TextInput
            style={[
              styles.input,
              styles.descInput,
              {
                backgroundColor: theme.colors.surfaceVariant,
                color: theme.colors.onSurface,
              },
            ]}
            placeholder="描述（可选）"
            placeholderTextColor={theme.colors.onSurfaceVariant}
            value={description}
            onChangeText={setDescription}
            maxLength={100}
            multiline
          />

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
    padding: 32,
  },
  card: {
    width: '100%',
    borderRadius: 24,
    padding: 24,
  },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 20 },
  input: {
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    marginBottom: 12,
  },
  descInput: {
    height: 80,
    paddingTop: 12,
    textAlignVertical: 'top',
  },
  actions: { flexDirection: 'row', gap: 12, marginTop: 8 },
  btn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  btnText: { fontSize: 15, fontWeight: '600' },
});
