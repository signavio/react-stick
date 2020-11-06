// @flow
import { useEffect } from 'react'

type WatcherFuncT = () => void
type OptionsT = {|
  updateOnAnimationFrame: boolean,
  enabled: boolean
|}

function useWatcher(
  watcher: WatcherFuncT,
  { updateOnAnimationFrame, enabled }: OptionsT
): void {
  useEffect(() => {
    let animationFrameId
    let idleCallbackId

    // do not track in node
    if (enabled && typeof window.requestAnimationFrame !== 'undefined') {
      const callback = () => {
        watcher()

        if (updateOnAnimationFrame) {
          animationFrameId = requestAnimationFrame(callback)
        } else {
          idleCallbackId = requestIdleCallback(callback)
        }
      }

      callback()
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }

      if (idleCallbackId) {
        cancelIdleCallback(idleCallbackId)
      }
    }
  }, [updateOnAnimationFrame, watcher, enabled])
}

export default useWatcher
