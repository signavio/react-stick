import 'requestidlecallback'

import invariant from 'invariant'
import React, {
  createContext,
  forwardRef,
  LegacyRef,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import { inline } from 'substyle'

import type { PositionT, StickPortalPropsT } from './types'
import { useWatcher } from './hooks'
import { scrollX, scrollY } from './utils'

const StickPortal = forwardRef<
  HTMLElement | undefined | null,
  StickPortalPropsT
>(function StickPortal(
  {
    children,
    component,
    style,
    transportTo,
    nestingKey,
    node,
    position,
    containerRef,
    updateOnAnimationFrame,
    onReposition,
    ...rest
  }: StickPortalPropsT,
  ref
) {
  const nodeRef = useRef<HTMLElement>()
  const [top, setTop] = useState<number | null>(null)
  const [left, setLeft] = useState<number | null>(null)
  const [visible, setVisible] = useState(!!node)

  const [host, hostParent] = useHost(transportTo)

  useEffect(() => {
    if (nodeRef.current) {
      onReposition(nodeRef.current)
    }
  }, [onReposition, top, left])

  useEffect(() => {
    setVisible(!!node)
  }, [node])

  useEffect(() => {
    if (hostParent == null || host == null) {
      return
    }

    if (visible) {
      hostParent.appendChild(host)

      return () => {
        hostParent.removeChild(host)
      }
    }
  }, [host, hostParent, visible])

  const measure = useCallback(() => {
    const node = nodeRef.current

    if (!node || !visible || host == null) {
      return
    }

    const newTop = calculateTop(node, position, host)
    const newLeft = calculateLeft(node, position, host)

    if (newTop !== top) {
      setTop(newTop)
    }

    if (newLeft !== left) {
      setLeft(newLeft)
    }
  }, [host, left, position, top, visible])

  useWatcher(measure, { updateOnAnimationFrame, enabled: visible })

  const Component: any = component || 'div'

  return (
    <Component
      {...rest}
      {...style}
      ref={(node: HTMLElement) => {
        if (typeof ref === 'function') {
          ref(node)
        } else if (ref) {
          ref.current = node
        }

        nodeRef.current = node
      }}
    >
      {children}

      {top != null && left != null && host != null && (
        <PortalContext.Provider
          value={(host.parentNode || document.body) as HTMLElement}
        >
          {createPortal(
            <div
              ref={containerRef as LegacyRef<HTMLDivElement>}
              data-sticknestingkey={nestingKey}
              {...inline(style('node'), {
                position: 'absolute',
                top,
                left,
              })}
            >
              {node}
            </div>,
            host
          )}
        </PortalContext.Provider>
      )}
    </Component>
  )
})

export const PortalContext = createContext<HTMLElement | null>(null)

export default StickPortal

function useHost(transportTo?: HTMLElement | null) {
  const [host] = useState<HTMLDivElement | null>(() => {
    if (typeof document === 'undefined') {
      return null
    }

    return document.createElement('div')
  })

  const portalHost = useContext(PortalContext)

  if (host == null) {
    return [null, null]
  }

  const hostParent = transportTo || portalHost || document.body

  invariant(hostParent, 'Could not determine a parent for the host node.')

  return [host, hostParent]
}

function calculateTop(
  node: HTMLElement,
  position: PositionT,
  host: HTMLElement
) {
  const { top, height, bottom } = node.getBoundingClientRect()
  const fixedHost = getFixedParent(host)

  let result = 0
  if (position.indexOf('top') !== -1) {
    result = top
  }
  if (position.indexOf('middle') !== -1) {
    result = top + height / 2
  }
  if (position.indexOf('bottom') !== -1) {
    result = bottom
  }

  if (fixedHost) {
    const { top: hostTop } = fixedHost.getBoundingClientRect()

    return result - hostTop
  }

  return result + scrollY()
}

function calculateLeft(
  node: HTMLElement,
  position: PositionT,
  host: HTMLElement
) {
  const { left, width, right } = node.getBoundingClientRect()

  const fixedHost = getFixedParent(host)
  const scrollHost = getScrollParent(node)

  let result = 0
  if (position.indexOf('left') !== -1) {
    result = left
  }
  if (position.indexOf('center') !== -1) {
    result = left + width / 2
  }
  if (position.indexOf('right') !== -1) {
    result = right
  }

  if (fixedHost) {
    const { left: hostLeft } = fixedHost.getBoundingClientRect()

    return result - hostLeft
  }

  if (scrollHost) {
    return result + scrollX(node) - scrollHost.scrollLeft
  }

  return result + scrollX(node)
}

function getScrollParent(element: Element): Element | null {
  if (!element) {
    return null
  }

  if (element.nodeName === 'BODY' || element.nodeName === 'HTML') {
    return null
  }

  const style = getComputedStyle(element)

  if (style.overflowX === 'auto' || style.overflowX === 'scroll') {
    return element
  }

  return element.parentNode instanceof Element
    ? getScrollParent(element.parentNode)
    : null
}

function getFixedParent(element: Element): Element | undefined | null {
  if (element.nodeName === 'BODY' || element.nodeName === 'HTML') {
    return null
  }

  if (getComputedStyle(element).position === 'fixed') {
    return element
  }

  return element.parentNode instanceof Element
    ? getFixedParent(element.parentNode)
    : null
}
