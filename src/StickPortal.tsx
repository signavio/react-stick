import 'requestidlecallback'

import invariant from 'invariant'
import React, {
  Ref,
  createContext,
  createElement,
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

import { useWatcher } from './hooks'
import { AllowedContainers, PositionT, StickPortalPropsT } from './types'
import { scrollX, scrollY } from './utils'

function StickPortal<T extends AllowedContainers>(
  {
    children,
    component: Component,
    style,
    transportTo,
    nestingKey,
    node,
    position,
    containerRef,
    updateOnAnimationFrame,
    onReposition,
    ...rest
  }: StickPortalPropsT<T>,
  ref: Ref<HTMLElement>
) {
  const nodeRef = useRef<null | Element>(null)
  const [top, setTop] = useState<null | number>(null)
  const [left, setLeft] = useState<null | number>(null)
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

  return createElement(
    Component,
    {
      ...rest,
      ...style,
      ref: (node: null | HTMLElement) => {
        if (typeof ref === 'function') {
          ref(node)
        } else {
          // @ts-ignore
          ref.current = node
        }

        nodeRef.current = node
      },
    },
    children,
    top != null && left != null && (
      <PortalContext.Provider value={host.parentNode || defaultRoot}>
        {createPortal(
          <div
            ref={(node) => {
              containerRef.current = node
            }}
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
    )
  )
}

invariant(
  document.body != null,
  'Stick can only be used in a browser environment.'
)

const defaultRoot = document.body

export const PortalContext = createContext<Node>(defaultRoot)

export default forwardRef(StickPortal)

function useHost(transportTo: HTMLElement | null | undefined): [Element, Node] {
  const [host] = useState(() => document.createElement('div'))

  const portalHost = useContext(PortalContext)

  const hostParent = transportTo || portalHost

  invariant(
    hostParent != null,
    'Could not determine a parent for the host node.'
  )

  return [host, hostParent]
}

function calculateTop(
  node: Element,
  position: PositionT,
  host: Element
): number {
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
  node: Element,
  position: PositionT,
  host: Element
): number {
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

function getScrollParent(element: null | Element): null | Element {
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

function getFixedParent(element: Element): null | Element {
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
