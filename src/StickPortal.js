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
    if (!nodeRef.current) {
      return
    }

    const boundingRect = nodeRef.current.getBoundingClientRect()

    const newTop = calculateTop(position, boundingRect, getFixedParent(host))
    const newLeft = calculateLeft(
      nodeRef.current,
      position,
      boundingRect,
      getFixedParent(host)
    )

    if (newTop !== top) {
      setTop(newTop)
    }

    if (newLeft !== left) {
      setLeft(newLeft)
    }
  }, [host, left, position, top])

  useWatcher(measure, { updateOnAnimationFrame })

  const { style: nodeStyle, ...otherNodeStyleProps } = style('node')

  const Component = component || 'div'
  return (
    <Component
      {...style}
      {...rest}
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
            {...otherNodeStyleProps}
            ref={containerRef}
            data-sticknestingkey={nestingKey}
            style={{
              position: 'absolute',
              // The position property should be be overwritten
              // $FlowFixMe
              ...nodeStyle,
              top,
              left,
            }}
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
  fixedHost: ?Element
) {
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
  fixedHost: ?Element
) {
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

  return result + scrollX(nodeRef)
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
