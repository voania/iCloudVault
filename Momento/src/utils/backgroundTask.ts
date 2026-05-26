import { InteractionManager } from 'react-native';

export interface BackgroundTaskSignal {
  readonly cancelled: boolean;
}

export class BackgroundTaskController implements BackgroundTaskSignal {
  private isCancelled = false;

  get cancelled(): boolean {
    return this.isCancelled;
  }

  cancel(): void {
    this.isCancelled = true;
  }
}

export function waitForIdle(): Promise<void> {
  return new Promise((resolve) => {
    InteractionManager.runAfterInteractions(() => resolve());
  });
}

export async function yieldToBackground(signal?: BackgroundTaskSignal): Promise<boolean> {
  if (signal?.cancelled) {
    return false;
  }

  await waitForIdle();
  return !signal?.cancelled;
}
