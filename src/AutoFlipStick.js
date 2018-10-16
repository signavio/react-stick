// @flow
import React, { Component } from 'react'
import invariant from 'invariant'
import { omit } from 'lodash'
import Stick from './Stick'

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
} from './utils'

import DEFAULT_POSITION, { positions } from './defaultPosition'

import {
  type AlignT,
  type PositionT,
  type VerticalTargetT,
  type HorizontalTargetT,
} from './flowTypes'

type ApiPropsT = {
  align?: AlignT,
  position?: PositionT,

  autoFlipVertically?: boolean,
  autoFlipHorizontally?: boolean,
}

type StateT = {
  align: AlignT,
  position: PositionT,
}

export default class AutoFlipStick extends Component<ApiPropsT, StateT> {
  constructor(props: ApiPropsT) {
    super(props)
    const { align, position } = props
    this.state = {
      align: align || getDefaultAlign(position || DEFAULT_POSITION),
      position: position || DEFAULT_POSITION,
    }
  }

  render() {
    const { position, align } = this.state
    return (
      <Stick
        {...omit(this.props, ['autoFlipVertically', 'autoFlipHorizontally'])}
        onReposition={this.handleReposition}
        position={position}
        align={align}
      />
    )
  }

  handleReposition = (nodeRef: HTMLElement, anchorRef: HTMLElement) => {
    const { autoFlipVertically, autoFlipHorizontally } = this.props
    if (autoFlipVertically) {
      this.flipVerticallyIfNeeded(nodeRef, anchorRef)
    }
    if (autoFlipHorizontally) {
      this.flipHorizontallyIfNeeded(nodeRef, anchorRef)
    }
  }

  flipVerticallyIfNeeded = (nodeRef: HTMLElement, anchorRef: HTMLElement) => {
    const { position, align } = this.state
    const initialPosition = this.props.position || DEFAULT_POSITION

    const positionedToBottom = isPositionedToBottom(position)
    const positionedToTop = isPositionedToTop(position)

    if (isPositionedToBottom(initialPosition)) {
      if (fitsOnBottom(nodeRef, anchorRef)) {
        if (!positionedToBottom) {
          this.setState({
            position: switchToBottom(position),
            align: switchToTop(align),
          })
        }
      } else if (fitsOnTop(nodeRef, anchorRef) && !positionedToTop) {
        this.setState({
          position: switchToTop(position),
          align: switchToBottom(align),
        })
      }
    }

    if (isPositionedToTop(initialPosition)) {
      if (fitsOnTop(nodeRef, anchorRef)) {
        if (!positionedToTop) {
          this.setState({
            position: switchToTop(position),
            align: switchToBottom(align),
          })
        }
      } else if (fitsOnBottom(nodeRef, anchorRef) && !positionedToBottom) {
        this.setState({
          position: switchToBottom(position),
          align: switchToTop(align),
        })
      }
    }
  }

  flipHorizontallyIfNeeded = (nodeRef: HTMLElement, anchorRef: HTMLElement) => {
    const { position, align } = this.state
    const initialPosition = this.props.position || DEFAULT_POSITION

    const positionedToLeft = isPositionedToLeft(position)
    const positionedToRight = isPositionedToRight(position)

    if (isPositionedToRight(initialPosition)) {
      if (fitsOnRight(nodeRef, anchorRef)) {
        if (!positionedToRight) {
          this.setState({
            position: switchToRight(position),
            align: switchToLeft(align),
          })
        }
      } else if (fitsOnLeft(nodeRef, anchorRef) && !positionedToLeft) {
        this.setState({
          position: switchToLeft(position),
          align: switchToRight(align),
        })
      }
    }

    if (isPositionedToLeft(initialPosition)) {
      if (fitsOnLeft(nodeRef, anchorRef)) {
        if (!positionedToLeft) {
          this.setState({
            position: switchToLeft(position),
            align: switchToRight(align),
          })
        }
      } else if (fitsOnRight(nodeRef, anchorRef) && !positionedToRight) {
        this.setState({
          position: switchToRight(position),
          align: switchToLeft(align),
        })
      }
    }
  }
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
