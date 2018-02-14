// @flow
import getDefaultAlign from './getDefaultAlign'
import DEFAULT_POSITION from './defaultPosition'
import type { PublicPropsT } from './flowTypes'

const getModifiers = ({ align, position, sameWidth }: PublicPropsT) => {
  const finalPosition = position || DEFAULT_POSITION
  const [verticalPosition, horizontalPosition] = finalPosition.split(' ')
  const [verticalAlign, horizontalAlign] = (
    align || getDefaultAlign(finalPosition)
  ).split(' ')
  return {
    [`&position-${horizontalPosition}`]: true,
    [`&position-${verticalPosition}`]: true,
    [`&align-${verticalAlign}-${horizontalAlign}`]: true,
    '&sameWidth': sameWidth,
  }
}

export default getModifiers
