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

export default getDefaultAlign
