import { create } from 'zustand';
import type { AiPipelineStatus, AiAnalysisResult, AiError } from '../types';

// ============================================================
// aiStore — AI 分析管线状态
// 接口设计：UI 只读 status，AI 模块通过 actions 写入
// 后期替换为真实 ML Kit + TFLite 管线，接口不变
// ============================================================

interface AiState {
  status: AiPipelineStatus;
  results: Map<string, AiAnalysisResult>; // photoId → result

  // ---- Actions ----
  startPipeline: (photoIds: string[]) => void;
  stopPipeline: () => void;
  /** AI 模块调用：报告单张照片分析完成 */
  reportResult: (result: AiAnalysisResult) => void;
  /** AI 模块调用：报告单张照片分析失败 */
  reportError: (error: AiError) => void;
  /** AI 模块调用：更新当前正在处理的照片 */
  setCurrentPhoto: (photoId: string | undefined) => void;
  resetPipeline: () => void;

  getResult: (photoId: string) => AiAnalysisResult | undefined;
}

export const useAiStore = create<AiState>((set, get) => ({
  status: {
    isRunning: false,
    queueSize: 0,
    processedCount: 0,
    currentPhotoId: undefined,
    errors: [],
  },
  results: new Map(),

  startPipeline: (photoIds) =>
    set({
      status: {
        isRunning: true,
        queueSize: photoIds.length,
        processedCount: 0,
        currentPhotoId: undefined,
        errors: [],
      },
    }),

  stopPipeline: () =>
    set((s) => ({
      status: { ...s.status, isRunning: false, currentPhotoId: undefined },
    })),

  reportResult: (result) => {
    const next = new Map(get().results);
    next.set(result.photoId, result);
    set((s) => ({
      results: next,
      status: {
        ...s.status,
        processedCount: s.status.processedCount + 1,
        currentPhotoId: undefined,
        isRunning: s.status.processedCount + 1 < s.status.queueSize,
      },
    }));
  },

  reportError: (error) =>
    set((s) => ({
      status: {
        ...s.status,
        processedCount: s.status.processedCount + 1,
        currentPhotoId: undefined,
        isRunning: s.status.processedCount + 1 < s.status.queueSize,
        errors: [...s.status.errors, error],
      },
    })),

  setCurrentPhoto: (photoId) =>
    set((s) => ({ status: { ...s.status, currentPhotoId: photoId } })),

  resetPipeline: () =>
    set({
      status: {
        isRunning: false,
        queueSize: 0,
        processedCount: 0,
        currentPhotoId: undefined,
        errors: [],
      },
      results: new Map(),
    }),

  getResult: (photoId) => get().results.get(photoId),
}));
