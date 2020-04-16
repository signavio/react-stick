// @flow
import 'requestidlecallback'

import invariant from 'invariant'
import { some } from 'lodash'
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { type HOC } from 'recompose'
import { type Substyle, defaultStyle } from 'substyle'

import { StickContext } from './StickContext'
import StickInline from './StickInline'
import StickNode from './StickNode'
import StickPortal from './StickPortal'
import DEFAULT_POSITION from './defaultPosition'
import { type AlignT, type ApiPropsT, type PositionT } from './flowTypes'
import { useAutoFlip, useWatcher } from './hooks'
import { getDefaultAlign, getModifiers, scrollX, uniqueId } from './utils'

type PropsT = {|
  ...ApiPropsT,

  style: Substyle,
|}

function Stick({
  inline,
  node,
  style,
  sameWidth,
  children,
  updateOnAnimationFrame,
  position,
  align,
  component,
  transportTo,
  autoFlipHorizontally,
  autoFlipVertically,
  onClickOutside,
  ...rest
}: PropsT) {
  const [width, setWidth] = useState(0)
  const [containerNestingKeyExtension] = useState(() => uniqueId())
  const nestingKey = [useContext(StickContext), containerNestingKeyExtension]
    .filter((key) => !!key)
    .join('_')

  const anchorRef = useRef()
  const nodeRef = useRef()
  const containerRef = useRef()

  const [resolvedPosition, resolvedAlign, checkAlignment] = useAutoFlip(
    !!autoFlipHorizontally,
    !!autoFlipVertically,
    position || DEFAULT_POSITION,
    align || getDefaultAlign(position || DEFAULT_POSITION)
  )

  useEffect(() => {
    const handleScroll = () => {
      if (!nodeRef.current || !anchorRef.current) {
        return
      }

      checkAlignment(nodeRef.current, anchorRef.current)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [checkAlignment])

  useEffect(() => {
    const handleClickOutside = (ev: MouseEvent) => {
      if (!onClickOutside) {
        return
      }

      const { target } = ev
      if (
        target instanceof window.HTMLElement &&
        isOutside(anchorRef, containerRef, target)
      ) {
        onClickOutside(ev)
      }
    }

    document.addEventListener('click', handleClickOutside, true)

    return () => {
      document.removeEventListener('click', handleClickOutside, true)
    }
  }, [onClickOutside])

  const measure = useCallback(() => {
    if (!anchorRef.current) {
      return
    }

    const boundingRect = anchorRef.current.getBoundingClientRect()

    const newWidth = sameWidth
      ? boundingRect.width
      : calculateWidth(
          anchorRef.current,
          resolvedPosition,
          resolvedAlign,
          boundingRect
        )

    if (newWidth !== width) {
      setWidth(newWidth)
    }
  }, [resolvedAlign, resolvedPosition, sameWidth, width])

  useWatcher(measure, { updateOnAnimationFrame: !!updateOnAnimationFrame })

  const resolvedStyle = style(
    getModifiers({ position: resolvedPosition, align: resolvedAlign })
  )

  const handleReposition = useCallback(() => {
    if (nodeRef.current && anchorRef.current) {
      checkAlignment(nodeRef.current, anchorRef.current)
    }
  }, [checkAlignment])

  if (inline) {
    return (
      <StickContext.Provider value={nestingKey}>
        <StickInline
          {...rest}
          position={resolvedPosition}
          align={resolvedAlign}
          style={resolvedStyle}
          node={
            node && (
              <StickNode
                width={width}
                position={resolvedPosition}
                align={resolvedAlign}
                sameWidth={!!sameWidth}
                nodeRef={nodeRef}
              >
                {node}
              </StickNode>
            )
          }
          nestingKey={nestingKey}
          containerRef={(node) => {
            anchorRef.current = node
            containerRef.current = node
          }}
          component={component}
        >
          {children}
        </StickInline>
      </StickContext.Provider>
    )
  }

  return (
    <StickContext.Provider value={nestingKey}>
      <StickPortal
        {...rest}
        updateOnAnimationFrame={!!updateOnAnimationFrame}
        transportTo={transportTo}
        component={component}
        ref={(node) => {
          invariant(
            !node || node instanceof Element,
            'Only HTML elements can be stick anchors.'
          )

          anchorRef.current = node
        }}
        position={resolvedPosition}
        node={
          node && (
            <StickNode
              width={width}
              position={resolvedPosition}
              align={resolvedAlign}
              sameWidth={!!sameWidth}
              nodeRef={nodeRef}
            >
              {node}
            </StickNode>
          )
        }
        style={resolvedStyle}
        nestingKey={nestingKey}
        containerRef={containerRef}
        onReposition={handleReposition}
      >
        {children}
      </StickPortal>
    </StickContext.Provider>
  )
}

function isOutside(anchorRef, containerRef, target: HTMLElement) {
  if (anchorRef.current && anchorRef.current.contains(target)) {
    return false
  }

  const nestingKey =
    containerRef.current &&
    containerRef.current.getAttribute('data-sticknestingkey')

  if (nestingKey) {
    // Find all stick nodes nested inside our own stick node and check if the click
    // happened on any of these (our own stick node will also be part of the query result)
    const nestedStickNodes = document.querySelectorAll(
      `[data-stickNestingKey^='${nestingKey}']`
    )
    return !some(nestedStickNodes, (stickNode) => stickNode.contains(target))
  }

  return true
}

function calculateWidth(
  anchorRef,
  position: PositionT,
  align: AlignT,
  { left, width, right }: ClientRect
): number {
  if (!anchorRef) {
    return 0
  }

  invariant(document.documentElement, 'Could not find document root node.')

  const scrollWidth = document.documentElement.scrollWidth

  const [, horizontalPosition] = position.split(' ')

  invariant(
    horizontalPosition === 'left' ||
      horizontalPosition === 'center' ||
      horizontalPosition === 'right',
    `Expected horizontal position to be "left", "center", or "right" but got "${horizontalPosition}".`
  )

  const positionAdjustments = {
    left,
    center: left + width / 2,
    right,
  }

  const absLeft = scrollX(anchorRef) + positionAdjustments[horizontalPosition]

  if (align.indexOf('left') !== -1) {
    return scrollWidth - absLeft
  }

  if (align.indexOf('right') !== -1) {
    return absLeft
  }

  if (align.indexOf('center') !== -1) {
    return Math.min(absLeft, scrollWidth - absLeft) * 2
  }

  return 0
}

const styled: HOC<*, ApiPropsT> = defaultStyle(
  {
    node: {
      position: 'absolute',
      zIndex: 99,
      textAlign: 'left',
    },
  },
  getModifiers
)

export default styled(Stick)
