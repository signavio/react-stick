// @flow
import DEFAULT_POSITION from '../defaultPosition'
import { type AlignT, type PositionT } from '../flowTypes'
import getDefaultAlign from './getDefaultAlign'

type PropsT = {
  align: AlignT,
  position: PositionT,
  sameWidth?: boolean,
}

const getModifiers = ({ align, position, sameWidth }: PropsT) => {
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
    '&sameWidth': !!sameWidth,
  }
}

export default getModifiers
