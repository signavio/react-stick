// @flow
import getDefaultAlign from './getDefaultAlign'
import type { PropsT } from './flowTypes'

const getModifiers = ({ align, position, sameWidth }: PropsT) => {
  const [verticalPosition, horizontalPosition] = position.split(' ')
  const [verticalAlign, horizontalAlign] = (
    align || getDefaultAlign(position)
  ).split(' ')
  return {
    [`&position-${horizontalPosition}`]: true,
    [`&position-${verticalPosition}`]: true,
    [`&align-${verticalAlign}-${horizontalAlign}`]: true,
    '&sameWidth': sameWidth,
  }
}

export default getModifiers
