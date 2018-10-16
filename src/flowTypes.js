// @flow
import type { Substyle } from 'substyle'
import type { Node } from 'react'

export type VerticalTargetT = 'bottom' | 'middle' | 'top'
export type HorizontalTargetT = 'left' | 'center' | 'right'

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

export type AlignT = PositionT

type SharedPropsT = {
  node?: Node,
  children?: Node,

  transportTo?: HTMLElement,

  component?: string,

  inline?: boolean,

  updateOnAnimationFrame?: boolean,
}

type SpecificStickBasePropsT = SharedPropsT & {
  style: Substyle,

  position: PositionT,
  align: AlignT,
}

export type StickInlinePropsT = SpecificStickBasePropsT & {
  // props injected by Stick
  containerRef: (element: ?HTMLElement) => void,
  nestingKey: string,
}

export type StickPortalPropsT = StickInlinePropsT
