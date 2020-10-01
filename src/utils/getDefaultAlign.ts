import { AlignT, HorizontalTargetT, PositionT, VerticalTargetT } from '../types'

const defaultVerticalAlign: { [T in VerticalTargetT]: VerticalTargetT } = {
  top: 'bottom',
  middle: 'middle',
  bottom: 'top',
}

const defaultHorizontalAlign: {
  [T in VerticalTargetT]: { [T in HorizontalTargetT]: HorizontalTargetT }
} = {
  top: {
    left: 'left',
    center: 'center',
    right: 'right',
  },
  middle: {
    left: 'right',
    center: 'center',
    right: 'left',
  },
  bottom: {
    left: 'left',
    center: 'center',
    right: 'right',
  },
}

const getDefaultAlign = ([
  verticalAlign,
  horizontalAlign,
]: PositionT): AlignT => [
  defaultVerticalAlign[verticalAlign],
  defaultHorizontalAlign[verticalAlign][horizontalAlign],
]

export default getDefaultAlign
