// @flow
import 'requestidlecallback'

import invariant from 'invariant'
import React, {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { inline } from 'substyle'
import { createPortal } from 'react-dom'

import type { PositionT, StickPortalPropsT } from './flowTypes'
import { useWatcher } from './hooks'
import { scrollX, scrollY } from './utils'

function StickPortal(
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
  const nodeRef = useRef()
  const [top, setTop] = useState(0)
  const [left, setLeft] = useState(0)
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

  useLayoutEffect(() => {
    if (visible) {
      hostParent.appendChild(host)

      return () => {
        hostParent.removeChild(host)
      }
    }
  }, [host, hostParent, visible])

  const measure = useCallback(() => {
    if (!nodeRef.current || !visible) {
      return
    }

    const boundingRect = nodeRef.current.getBoundingClientRect()

    const newTop = calculateTop(position, boundingRect, host)
    const newLeft = calculateLeft(nodeRef.current, position, boundingRect, host)

    if (newTop !== top) {
      setTop(newTop)
    }

    if (newLeft !== left) {
      setLeft(newLeft)
    }
  }, [host, left, position, top, visible])

  useWatcher(measure, { updateOnAnimationFrame })

  const Component = component || 'div'
  return (
    <Component
      {...rest}
      {...style}
      ref={(node) => {
        if (typeof ref === 'function') {
          ref(node)
        } else {
          ref.current = node
        }

        nodeRef.current = node
      }}
    >
      {children}

      <PortalContext.Provider value={host.parentNode}>
        {createPortal(
          <div
            ref={containerRef}
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
    </Component>
  )
}

const PortalContext = createContext<?Node>(null)

export default forwardRef<StickPortalPropsT, ?HTMLElement>(StickPortal)

function useHost(transportTo) {
  const [host] = useState(() => document.createElement('div'))

  const portalHost = useContext(PortalContext)

  const hostParent = transportTo || portalHost || document.body

  invariant(hostParent, 'Could not determine a parent for the host node.')

  return [host, hostParent]
}

function calculateTop(
  position: PositionT,
  { top, height, bottom }: ClientRect,
  host: Element
) {
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
  nodeRef,
  position: PositionT,
  { left, width, right }: ClientRect,
  host: Element
) {
  const fixedHost = getFixedParent(host)
  const scrollHost = getScrollParent(nodeRef)

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
    return result + scrollX(nodeRef) - scrollHost.scrollLeft
  }

  return result + scrollX(nodeRef)
}

function getScrollParent(element) {
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

function getFixedParent(element: Element): ?Element {
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
