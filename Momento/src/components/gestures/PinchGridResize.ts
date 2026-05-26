import { Gesture } from 'react-native-gesture-handler';
import { useSharedValue, runOnJS } from 'react-native-reanimated';
import { useSettingsStore, useUiStore } from '../../store';
import { GRID } from '../../utils/constants';

// ============================================================
// PinchGridResize — 捏合缩放手势改变网格列数
// 使用方式：在 GridScreen 的容器上附加此手势
// ============================================================

export function usePinchGridResize() {
  const scale = useSharedValue(1);
  const setGridColumns = useSettingsStore((s) => s.setGridColumns);
  const gridColumns = useSettingsStore((s) => s.gridColumns);

  const updateColumns = (newCols: number) => {
    setGridColumns(newCols);
  };

  const gesture = Gesture.Pinch()
    .onStart(() => {
      scale.value = 1;
    })
    .onUpdate((event) => {
      scale.value = event.scale;
    })
    .onEnd(() => {
      if (scale.value > 1.15 && gridColumns > GRID.MIN_COLUMNS) {
        runOnJS(updateColumns)(gridColumns - 1);
      } else if (scale.value < 0.85 && gridColumns < GRID.MAX_COLUMNS) {
        runOnJS(updateColumns)(gridColumns + 1);
      }
      scale.value = 1;
    });

  return gesture;
}
