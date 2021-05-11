// @flow
import invariant from 'invariant'
import { useCallback, useState, useEffect } from 'react'

import { positions } from '../defaultPosition'
import {
  type AlignT,
  type HorizontalTargetT,
  type PositionT,
  type VerticalTargetT,
} from '../flowTypes'
import {
  fitsOnBottom,
  fitsOnLeft,
  fitsOnRight,
  fitsOnTop,
  getDefaultAlign,
  isPositionedToBottom,
  isPositionedToLeft,
  isPositionedToRight,
  isPositionedToTop,
} from '../utils'

type CheckFuncT = (node: HTMLElement, anchor: HTMLElement) => void

const useAutoFlip = (
  enableAutoHorizontalFlip: boolean,
  enableAutoVerticalFlip: boolean,
  initialPosition: PositionT,
  initialAlign: AlignT
): [PositionT, AlignT, CheckFuncT] => {
  const [currentPosition, setCurrentPosition] = useState(initialPosition)
  const [currentAlign, setCurrentAlign] = useState(
    initialAlign || getDefaultAlign(initialPosition)
  )

  useEffect(() => {
    setCurrentPosition(initialPosition);
    setCurrentAlign(initialAlign || getDefaultAlign(initialPosition));
  }, [initialAlign, initialPosition]);

  const checkAlignment = useCallback(
    (nodeRef, anchorRef) => {
      const [horizontalPosition, horizontalAlign] = autoFlipHorizontally(
        nodeRef,
        anchorRef,
        {
          enabled: enableAutoHorizontalFlip,
          initialPosition,
          initialAlign,
          currentPosition,
          currentAlign,
        }
      )

      const [verticalPosition, verticalAlign] = autoFlipVertically(
        nodeRef,
        anchorRef,
        {
          enabled: enableAutoVerticalFlip,
          initialPosition,
          initialAlign,
          currentPosition: horizontalPosition,
          currentAlign: horizontalAlign,
        }
      )

      if (verticalPosition !== currentPosition) {
        setCurrentPosition(verticalPosition)
      }

      if (verticalAlign !== currentAlign) {
        setCurrentAlign(verticalAlign)
      }
    },
    [
      currentAlign,
      currentPosition,
      enableAutoHorizontalFlip,
      enableAutoVerticalFlip,
      initialAlign,
      initialPosition,
    ]
  )

  return [currentPosition, currentAlign, checkAlignment]
}

export default useAutoFlip

type OptionsT = {|
  enabled: boolean,

  initialPosition: PositionT,
  currentPosition: PositionT,

  initialAlign: AlignT,
  currentAlign: AlignT,
|}

const autoFlipVertically = (
  nodeRef: HTMLElement,
  anchorRef: HTMLElement,
  {
    enabled,
    initialPosition,
    currentPosition,
    initialAlign,
    currentAlign,
  }: OptionsT
) => {
  if (!enabled) {
    return [currentPosition, currentAlign]
  }

  const positionedToBottom = isPositionedToBottom(currentPosition)
  const positionedToTop = isPositionedToTop(currentPosition)

  if (isPositionedToBottom(initialPosition)) {
    if (fitsOnBottom(nodeRef, anchorRef)) {
      if (!positionedToBottom) {
        return [switchToBottom(currentPosition), switchToTop(currentAlign)]
      }
    } else if (fitsOnTop(nodeRef, anchorRef) && !positionedToTop) {
      return [switchToTop(currentPosition), switchToBottom(currentAlign)]
    }
  }

  if (isPositionedToTop(initialPosition)) {
    if (fitsOnTop(nodeRef, anchorRef)) {
      if (!positionedToTop) {
        return [switchToTop(currentPosition), switchToBottom(currentAlign)]
      }
    } else if (fitsOnBottom(nodeRef, anchorRef) && !positionedToBottom) {
      return [switchToBottom(currentPosition), switchToTop(currentAlign)]
    }
  }

  return [currentPosition, currentAlign]
}

const autoFlipHorizontally = (
  nodeRef: HTMLElement,
  anchorRef: HTMLElement,
  {
    enabled,
    initialPosition,
    currentPosition,
    initialAlign,
    currentAlign,
  }: OptionsT
) => {
  if (!enabled) {
    return [currentPosition, currentAlign]
  }

  const positionedToLeft = isPositionedToLeft(currentPosition)
  const positionedToRight = isPositionedToRight(currentPosition)

  if (isPositionedToRight(initialPosition)) {
    if (fitsOnRight(nodeRef, anchorRef)) {
      if (!positionedToRight) {
        return [switchToRight(currentPosition), switchToLeft(currentAlign)]
      }
    } else if (fitsOnLeft(nodeRef, anchorRef) && !positionedToLeft) {
      return [switchToLeft(currentPosition), switchToRight(currentAlign)]
    }
  }

  if (isPositionedToLeft(initialPosition)) {
    if (fitsOnLeft(nodeRef, anchorRef)) {
      if (!positionedToLeft) {
        return [switchToLeft(currentPosition), switchToRight(currentAlign)]
      }
    } else if (fitsOnRight(nodeRef, anchorRef) && !positionedToRight) {
      return [switchToRight(currentPosition), switchToLeft(currentAlign)]
    }
  }

  return [currentPosition, currentAlign]
}

const switchVerticalPosition = (
  position: PositionT,
  target: VerticalTargetT
) => {
  const newPosition: ?PositionT = positions.find(
    (standardPosition: PositionT) =>
      standardPosition === `${target} ${position.split(' ')[1]}`
  )

  invariant(
    newPosition,
    `Could not determine new position. Old position "${position}", new vertical target "${target}"`
  )

  return newPosition
}
const switchHorizontalPosition = (
  position: PositionT,
  target: HorizontalTargetT
) => {
  const newPosition: ?PositionT = positions.find(
    (standardPosition: PositionT) =>
      standardPosition === `${position.split(' ')[0]} ${target}`
  )

  invariant(
    newPosition,
    `Could not determine new position. Old position "${position}", new horizontal target "${target}"`
  )

  return newPosition
}

const switchToBottom = (position: PositionT) =>
  switchVerticalPosition(position, 'bottom')
const switchToTop = (position: PositionT) =>
  switchVerticalPosition(position, 'top')

const switchToLeft = (position: PositionT) =>
  switchHorizontalPosition(position, 'left')
const switchToRight = (position: PositionT) =>
  switchHorizontalPosition(position, 'right')
