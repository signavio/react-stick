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
import { createPortal } from 'react-dom'
import { inline } from 'substyle'

import type { StickPortalPropsT } from './flowTypes'
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
  const [top, setTop] = useState(null)
  const [left, setLeft] = useState(null)
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
    const node = nodeRef.current

    if (!node || !visible) {
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

      {top != null && left != null && (
        <PortalContext.Provider value={host.parentNode || defaultRoot}>
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
      )}
    </Component>
  )
}

invariant(document.body, 'Stick can only be used in a browser environment.')

const defaultRoot = document.body

export const PortalContext = createContext<Node>(defaultRoot)

export default forwardRef<StickPortalPropsT, ?HTMLElement>(StickPortal)

function useHost(transportTo) {
  const [host] = useState(() => document.createElement('div'))

  const portalHost = useContext(PortalContext)

  const hostParent = transportTo || portalHost

  invariant(hostParent, 'Could not determine a parent for the host node.')

  return [host, hostParent]
}

function calculateTop(node, position, host) {
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

function calculateLeft(node, position, host) {
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
