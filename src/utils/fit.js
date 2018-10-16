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
  const positionMarker = position.split(' ')[1]

  return positionMarker === 'right'
}

export const isPositionedToLeft = (position: PositionT): boolean => {
  const positionMarker = position.split(' ')[1]

  return positionMarker === 'left'
}

export const fitsOnRight = (
  nodeRef: HTMLElement,
  anchorRef: HTMLElement
): boolean => {
  const { width: nodeWidth } = nodeRef.getBoundingClientRect()
  const { right: anchorRight } = anchorRef.getBoundingClientRect()

  return anchorRight + nodeWidth <= window.innerWidth
}

export const fitsOnLeft = (
  nodeRef: HTMLElement,
  anchorRef: HTMLElement
): boolean => {
  const { width: nodeWidth } = nodeRef.getBoundingClientRect()
  const { left: anchorLeft } = anchorRef.getBoundingClientRect()

  return anchorLeft - nodeWidth >= 0
}

export const fitsOnTop = (
  nodeRef: HTMLElement,
  anchorRef: HTMLElement
): boolean => {
  const { height: nodeHeight } = nodeRef.getBoundingClientRect()
  const { top: anchorTop } = anchorRef.getBoundingClientRect()

  return anchorTop - nodeHeight >= 0
}

export const fitsOnBottom = (
  nodeRef: HTMLElement,
  anchorRef: HTMLElement
): boolean => {
  const { height: nodeHeight } = nodeRef.getBoundingClientRect()
  const { bottom: anchorBottom } = anchorRef.getBoundingClientRect()

  return anchorBottom + nodeHeight <= window.innerHeight
}
