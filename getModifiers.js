// @flow
import type { PositionT } from './flowTypes'

const getDefaultAlign = (position: PositionT) =>
  position
    .split(' ')
    .map(
      (positionPart: string) =>
        ({
          top: 'bottom',
          middle: 'middle',
          bottom: 'top',
          left: position.indexOf('middle') ? 'left' : 'right',
          center: 'center',
          right: position.indexOf('middle') ? 'right' : 'left',
        }[positionPart])
    )
    .join(' ')

const DEFAULT_POSITION = 'bottom left'

const getModifiers = ({ align, position = DEFAULT_POSITION }: PropsT) => {
  const [verticalPosition, horizontalPosition] = position.split(' ')
  const [verticalAlign, horizontalAlign] = (align || getDefaultAlign(position))
    .split(' ')
  return {
    [`&position-${horizontalPosition}`]: true,
    [`&position-${verticalPosition}`]: true,
    [`&align-${verticalAlign}-${horizontalAlign}`]: true,
  }
}

export default getModifiers
