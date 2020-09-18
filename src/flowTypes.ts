import { ComponentProps, MutableRefObject, ReactHTML, ReactNode } from 'react'
import { StylingProps, Substyle } from 'substyle'

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

export type AllowedContainers = keyof ReactHTML

export type StickPropsT<T extends AllowedContainers> = StylingProps &
  ComponentProps<T> & {
    position?: PositionT
    align?: AlignT

    inline?: boolean
    sameWidth?: boolean
    autoFlipVertically?: boolean
    autoFlipHorizontally?: boolean

    updateOnAnimationFrame?: boolean

    component?: T

    transportTo?: HTMLElement

    node: void | ReactNode
    children: ReactNode

    onClickOutside?: (ev: MouseEvent) => void
  }

type SpecificStickBasePropsT<T extends AllowedContainers> = ComponentProps<
  T
> & {
  children: ReactNode
  node: null | ReactNode

  component: T
  style: Substyle

  nestingKey: string
}

export type StickInlinePropsT<
  T extends AllowedContainers
> = SpecificStickBasePropsT<T> & {
  position: PositionT
  align: AlignT
}

export type StickPortalPropsT<
  T extends AllowedContainers
> = SpecificStickBasePropsT<T> & {
  transportTo: void | HTMLElement

  position: PositionT

  updateOnAnimationFrame: boolean
  containerRef: MutableRefObject<null | HTMLElement>

  onReposition: (nodeRef: Element) => void
}
