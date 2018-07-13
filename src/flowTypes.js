// @flow
import type { Substyle } from 'substyle'
import type { Node } from 'react'

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

type SharedPropsT = {
  node?: Node,
  children?: Node,

  transportTo?: HTMLElement,

  component?: string,

  inline?: boolean,

  updateOnAnimationFrame?: boolean,
}

type StickBasePropsT = SharedPropsT & {
  align?: PositionT,

  sameWidth?: boolean,

  onClickOutside?: (ev: MouseEvent) => void,
}

// the props we are dealing with in Stick
export type StickPropsT = StickBasePropsT & {
  // props handled by Stick and not passed further down to specific stick components
  style: Substyle,
  position: PositionT,
}

// the props the user has to pass to the Stick
export type PublicPropsT = StickBasePropsT & {
  // position is optional, but has a default value
  position?: PositionT,
  // style is optional, but will be injected by substyle
  style?: Substyle,
}

type SpecificStickBasePropsT = SharedPropsT & {
  style: Substyle,

  position: PositionT,
}

export type StickInlinePropsT = SpecificStickBasePropsT & {
  // props injected by Stick
  containerRef: (element: ?HTMLElement) => void,
  nestingKey: string,
}

export type StickPortalPropsT = StickInlinePropsT
