// @flow
import type { Substyle } from 'substyle'

export type PositionT =
  | 'bottom left'
  | 'bottom center'
  | 'bottom right'
  | 'middle left'
  | 'middle center'
  | 'middle right'
  | 'top left'
  | 'top center'
  | 'top right'

export type PropsT = {
  node?: React$Element<any>,
  children?: React$Element<any>,
  position?: PositionT,
  align?: PositionT,
  inline?: boolean,
  updateOnAnimationFrame?: boolean,
  nodeWidth?: number | string,
  containerRef: (element: HTMLElement | null) => void,
  style: Substyle,
}
