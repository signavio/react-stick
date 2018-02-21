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

type CommonPropsT = {
  node?: React$Element<any>,
  children?: React$Element<any>,
  position: PositionT,
  inline?: boolean,
  updateOnAnimationFrame?: boolean,
  transportTo?: HTMLElement,
  style: Substyle,
}

// the props we are dealing with in Stick
export type PrivatePropsT = CommonPropsT & {
  // props handled by Stick and not passed further down to specific stick components
  align?: PositionT,
  inline?: boolean,
  sameWidth?: boolean,
  onClickOutside?: (ev: Event) => void,
}

// the props we are dealing with in StickInline and StickPortal
export type PrivateSpecificPropsT = CommonPropsT & {
  // props injected by Stick
  containerRef: (element: HTMLElement | null) => void,
  anchorRef: (element: HTMLElement | null) => void,
  nestingKey: string,
}

// the props the user has to pass to the Stick
export type PublicPropsT = PrivatePropsT & {
  // position is optional, but has a default value
  position?: PositionT,
  // style is optional, but will be injected by substyle
  style?: Substyle,
}
