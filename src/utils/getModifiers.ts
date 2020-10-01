import DEFAULT_POSITION from '../defaultPosition'
import { AlignT, PositionT } from '../types'
import getDefaultAlign from './getDefaultAlign'

type PropsT = {
  align: AlignT
  position: PositionT
  sameWidth?: boolean
}

const getModifiers = ({ align, position, sameWidth }: PropsT) => {
  const finalPosition = position || DEFAULT_POSITION
  const [verticalPosition, horizontalPosition] = finalPosition
  const [verticalAlign, horizontalAlign] =
    align || getDefaultAlign(finalPosition)
  return {
    [`&position-${horizontalPosition}`]: true,
    [`&position-${verticalPosition}`]: true,
    [`&align-${horizontalAlign}`]: true,
    [`&align-${verticalAlign}`]: true,
    '&sameWidth': !!sameWidth,
  }
}

export default getModifiers
