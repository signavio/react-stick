// @flow
import { type PublicPropsT } from '../flowTypes'
import DEFAULT_POSITION from '../defaultPosition'

import getDefaultAlign from './getDefaultAlign'

const getModifiers = ({ align, position, sameWidth }: PublicPropsT) => {
  const finalPosition = position || DEFAULT_POSITION
  const [verticalPosition, horizontalPosition] = finalPosition.split(' ')
  const [verticalAlign, horizontalAlign] = (
    align || getDefaultAlign(finalPosition)
  ).split(' ')
  return {
    [`&position-${horizontalPosition}`]: true,
    [`&position-${verticalPosition}`]: true,
    [`&align-${horizontalAlign}`]: true,
    [`&align-${verticalAlign}`]: true,
    '&sameWidth': sameWidth,
  }
}

export default getModifiers
