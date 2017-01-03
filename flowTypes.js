// @flow

export type PositionT = 'bottom left' | 'bottom center' | 'bottom right' |
  'middle left' | 'middle center' | 'middle right' |
  'top left' | 'top center' | 'top right';

export type PropsT = {
  node: React$Element,
  children?: React$Element,
  position?: PositionT,
  align?: PositionT,
  inline?: boolean,
};
