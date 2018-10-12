// @flow
import { type PositionT } from '../flowTypes'

export const isPositionedToTop = (position: PositionT): boolean => {
  const [positionMarker] = position.split(' ')

  return positionMarker === 'top'
}

export const isPositionedToBottom = (position: PositionT): boolean => {
  const [positionMarker] = position.split(' ')

  return positionMarker === 'bottom'
}

export const isPositionedToRight = (position: PositionT): boolean => {
  const [positionMarker] = position.split(' ')

  return positionMarker === 'right'
}

export const isPositionedToLeft = (position: PositionT): boolean => {
  const [positionMarker] = position.split(' ')

  return positionMarker === 'left'
}

export const fitsOnRight = (
  nodeRef: HTMLElement,
  stickRef: HTMLElement
): boolean => {
  const { width: nodeWidth } = nodeRef.getBoundingClientRect()
  const { right: stickRight } = stickRef.getBoundingClientRect()

  return stickRight + nodeWidth < window.innerWidth
}

export const fitsOnLeft = (
  nodeRef: HTMLElement,
  stickRef: HTMLElement
): boolean => {
  const { width: nodeWidth } = nodeRef.getBoundingClientRect()
  const { left: stickLeft } = nodeRef.getBoundingClientRect()

  return stickLeft - nodeWidth > 0
}

export const fitsOnTop = (
  nodeRef: HTMLElement,
  stickRef: HTMLElement
): boolean => {
  const { height: nodeHeight } = nodeRef.getBoundingClientRect()
  const { top: stickTop } = stickRef.getBoundingClientRect()

  return stickTop - nodeHeight > 0
}

export const fitsOnBottom = (
  nodeRef: HTMLElement,
  stickRef: HTMLElement
): boolean => {
  const { height: nodeHeight } = nodeRef.getBoundingClientRect()
  const { bottom: stickBottom } = stickRef.getBoundingClientRect()

  return stickBottom + nodeHeight < window.innerHeight
}
