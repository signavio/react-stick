import { useEffect } from "react";

type WatcherFuncT = () => void;

export type WatcherOptions = {
  updateOnAnimationFrame: boolean;
};

function useWatcher(
  watcher: WatcherFuncT,
  { updateOnAnimationFrame }: WatcherOptions
): void {
  useEffect(() => {
    let animationFrameId: number;
    let idleCallbackId: number;

    // do not track in node
    if (typeof window.requestAnimationFrame !== "undefined") {
      const callback = () => {
        watcher();

        if (updateOnAnimationFrame) {
          animationFrameId = requestAnimationFrame(callback);
        } else {
          idleCallbackId = requestIdleCallback(callback);
        }
      };

      callback();
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }

      if (idleCallbackId) {
        cancelIdleCallback(idleCallbackId);
      }
    };
  }, [updateOnAnimationFrame, watcher]);
}

export default useWatcher;
