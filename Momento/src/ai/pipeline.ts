import { useAiStore, usePhotoStore } from '../store';
import type { AiAnalysisResult, Photo } from '../types';
import { BackgroundTaskController, yieldToBackground } from '../utils/backgroundTask';

export interface IAiProcessor {
  readonly name: string;
  analyze(photo: Photo): Promise<Partial<AiAnalysisResult>>;
}

class AiPipeline {
  private queue: string[] = [];
  private running = false;
  private processors: IAiProcessor[] = [];
  private allPhotos: Photo[] = [];
  private controller: BackgroundTaskController | null = null;
  private batchSize = 4;

  registerProcessor(processor: IAiProcessor): void {
    this.processors.push(processor);
  }

  getProcessorCount(): number {
    return this.processors.length;
  }

  async queuePhotos(photos: Photo[]): Promise<void> {
    this.allPhotos = photos;
    const ids = photos.map((p) => p.id);
    this.queue.push(...ids);
    useAiStore.getState().startPipeline([...this.queue]);
    if (!this.running) {
      this.running = true;
      this.controller = new BackgroundTaskController();
      this.processQueue();
    }
  }

  private async processQueue(): Promise<void> {
    const photoMap = new Map(this.allPhotos.map((p) => [p.id, p]));
    const controller = this.controller;
    let processedSinceYield = 0;
    let pendingPhotoUpdates: Array<{ id: string; patch: Partial<Photo> }> = [];

    const flushPhotoUpdates = () => {
      if (pendingPhotoUpdates.length === 0) return;
      usePhotoStore.getState().updatePhotos(pendingPhotoUpdates);
      pendingPhotoUpdates = [];
    };

    while (this.queue.length > 0) {
      if (controller?.cancelled) break;

      const id = this.queue.shift()!;
      const photo = photoMap.get(id);
      if (!photo) continue;

      useAiStore.getState().setCurrentPhoto(id);

      try {
        const partials = await Promise.all(
          this.processors.map((proc) =>
            proc.analyze(photo).catch((): Partial<AiAnalysisResult> => ({})),
          ),
        );

        const result: AiAnalysisResult = {
          photoId: id,
          labels: [],
          category: 'other',
          faceCount: 0,
          textBlocks: [],
        };

        for (const p of partials) {
          if (p.labels) result.labels.push(...p.labels);
          if (p.category) result.category = p.category;
          if (p.faceCount) result.faceCount = p.faceCount;
          if (p.textBlocks) result.textBlocks.push(...p.textBlocks);
          if (p.embedding) result.embedding = p.embedding;
        }

        result.labels = [...new Set(result.labels)];

        useAiStore.getState().reportResult(result);

        pendingPhotoUpdates.push({
          id,
          patch: {
            aiTags: result.labels,
            aiCategory: result.category,
            faceCount: result.faceCount,
            embedding: result.embedding ?? null,
          },
        });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        useAiStore.getState().reportError({
          photoId: id,
          message,
          timestamp: Date.now(),
        });
      }

      processedSinceYield += 1;
      if (processedSinceYield >= this.batchSize) {
        processedSinceYield = 0;
        flushPhotoUpdates();
        const canContinue = await yieldToBackground(controller ?? undefined);
        if (!canContinue) break;
      }
    }

    flushPhotoUpdates();
    this.running = false;
    this.controller = null;
    useAiStore.getState().setCurrentPhoto(undefined);
  }

  stop(): void {
    this.controller?.cancel();
    this.queue.length = 0;
    this.running = false;
    useAiStore.getState().stopPipeline();
  }
}

let pipeline: AiPipeline | null = null;

export function getAiPipeline(): AiPipeline {
  if (!pipeline) pipeline = new AiPipeline();
  return pipeline;
}
