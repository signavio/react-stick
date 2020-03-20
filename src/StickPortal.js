// @flow
import 'requestidlecallback'

import React, {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
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

  const host = useHost(transportTo)

  useEffect(() => {
    if (nodeRef.current) {
      onReposition(nodeRef.current)
    }
  }, [onReposition, top, left])

  const measure = useCallback(() => {
    if (!nodeRef.current) {
      return
    }

    const boundingRect = nodeRef.current.getBoundingClientRect()
    const isFixed = hasFixedPosition(host)

    const newTop = calculateTop(position, boundingRect, isFixed)
    const newLeft = calculateLeft(
      nodeRef.current,
      position,
      boundingRect,
      isFixed
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
      ref={node => {
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

  useEffect(() => {
    const hostParent = transportTo || portalHost || document.body

    if (hostParent) {
      hostParent.appendChild(host)
    }

    return () => {
      if (hostParent) {
        hostParent.removeChild(host)
      }
    }
  }, [host, portalHost, transportTo])

  return host
}

function calculateTop(
  position: PositionT,
  { top, height, bottom }: ClientRect,
  isFixed: boolean
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
  return result + (isFixed ? 0 : scrollY())
}

function calculateLeft(
  nodeRef,
  position: PositionT,
  { left, width, right }: ClientRect,
  isFixed: boolean
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
  return result + (isFixed ? 0 : scrollX(nodeRef))
}

function hasFixedPosition(element: Element) {
  if (element.nodeName === 'BODY' || element.nodeName === 'HTML') {
    return false
  }
  if (getComputedStyle(element).position === 'fixed') {
    return true
  }
  return element.parentNode instanceof Element
    ? hasFixedPosition(element.parentNode)
    : false
}
