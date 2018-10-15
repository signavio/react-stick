// @flow
import { find } from 'lodash'
import { withStateHandlers } from 'recompose'
import invariant from 'invariant'

import {
  getDefaultAlign,
  isPositionedToBottom,
  isPositionedToTop,
  isPositionedToLeft,
  isPositionedToRight,
  fitsOnBottom,
  fitsOnLeft,
  fitsOnRight,
  fitsOnTop,
} from '../utils'

import DEFAULT_POSITION, { positions } from '../defaultPosition'

import {
  type AlignT,
  type PositionT,
  type VerticalTargetT,
  type HorizontalTargetT,
} from '../flowTypes'

type ApiPropsT = {
  align?: AlignT,
  position?: PositionT,
}

type StateT = {
  align: AlignT,
  position: PositionT,
  initialPosition: PositionT,
}

export default withStateHandlers(
  ({ align, position }: ApiPropsT) => ({
    align: align || getDefaultAlign(position || DEFAULT_POSITION),
    position: position || DEFAULT_POSITION,
    initialPosition: position || DEFAULT_POSITION,
  }),
  {
    onFlipVerticallyIfNeeded: ({
      position,
      align,
      initialPosition,
    }: StateT) => (nodeRef: HTMLElement, anchorRef: HTMLElement) => {
      const positionedToBottom = isPositionedToBottom(position)
      const positionedToTop = isPositionedToTop(position)

      if (isPositionedToBottom(initialPosition)) {
        if (fitsOnBottom(nodeRef, anchorRef)) {
          if (!positionedToBottom) {
            return {
              position: switchToBottom(position),
              align: switchToTop(align),
            }
          }
        } else if (fitsOnTop(nodeRef, anchorRef) && !positionedToTop) {
          return {
            position: switchToTop(position),
            align: switchToBottom(align),
          }
        }
      }

      if (isPositionedToTop(initialPosition)) {
        if (fitsOnTop(nodeRef, anchorRef)) {
          if (!positionedToTop) {
            return {
              position: switchToTop(position),
              align: switchToBottom(align),
            }
          }
        } else if (fitsOnBottom(nodeRef, anchorRef) && !positionedToBottom) {
          return {
            position: switchToBottom(position),
            align: switchToTop(align),
          }
        }
      }
    },
    onFlipHorizontallyIfNeeded: ({
      position,
      align,
      initialPosition,
    }: StateT) => (nodeRef: HTMLElement, anchorRef: HTMLElement) => {
      const positionedToLeft = isPositionedToLeft(position)
      const positionedToRight = isPositionedToRight(position)

      if (isPositionedToRight(initialPosition)) {
        if (fitsOnRight(nodeRef, anchorRef)) {
          if (!positionedToRight) {
            return {
              position: switchToRight(position),
              align: switchToLeft(align),
            }
          }
        } else if (fitsOnLeft(nodeRef, anchorRef) && !positionedToLeft) {
          return {
            position: switchToLeft(position),
            align: switchToRight(align),
          }
        }
      }

      if (isPositionedToLeft(initialPosition)) {
        if (fitsOnLeft(nodeRef, anchorRef)) {
          if (!positionedToLeft) {
            return {
              position: switchToLeft(position),
              align: switchToRight(align),
            }
          }
        } else if (fitsOnRight(nodeRef, anchorRef) && !positionedToRight) {
          return {
            position: switchToRight(position),
            align: switchToLeft(align),
          }
        }
      }
    },
  }
)

const switchVerticalPosition = (
  position: PositionT,
  target: VerticalTargetT
) => {
  const newPosition: ?PositionT = find(
    positions,
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
  const newPosition: ?PositionT = find(
    positions,
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
