// @flow
import type { Node } from 'react'
import type { StylingProps, Substyle } from 'substyle'

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

export type RefT =
  | {|
      current: ?HTMLElement,
    |}
  | ((node: ?HTMLElement) => void)

export type StickPropsT = {|
  ...$Exact<StylingProps>,

  position?: PositionT,
  align?: AlignT,

  inline?: boolean,
  sameWidth?: boolean,
  autoFlipVertically?: boolean,
  autoFlipHorizontally?: boolean,

  updateOnAnimationFrame?: boolean,

  component?: string,

  transportTo?: HTMLElement,

  node: ?Node,
  children: Node,

  onClickOutside?: (ev: MouseEvent) => void,
|}

type SpecificStickBasePropsT = {|
  children: Node,
  node: ?Node,

  component: ?string,
  style: Substyle,

  nestingKey: string,

  containerRef: RefT,
|}

export type StickInlinePropsT = {|
  ...SpecificStickBasePropsT,

  position: PositionT,
  align: AlignT,
|}

export type StickPortalPropsT = {|
  ...SpecificStickBasePropsT,

  transportTo: ?HTMLElement,

  position: PositionT,

  updateOnAnimationFrame: boolean,

  onReposition: (nodeRef: HTMLElement) => void,
|}
