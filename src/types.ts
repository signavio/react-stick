import { ComponentProps, ReactHTML, ReactNode, ReactSVG, Ref } from 'react'
import { StylingProps, Substyle } from 'substyle'

export type VerticalTargetT = 'bottom' | 'middle' | 'top'
export type HorizontalTargetT = 'left' | 'center' | 'right'

export type PositionT = [VerticalTargetT, HorizontalTargetT]

export type AlignT = PositionT

type AllowedHTMLContainers = keyof ReactHTML
type AllowedSVGContainers = keyof ReactSVG

export type AllowedContainers = AllowedHTMLContainers | AllowedSVGContainers

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

    transportTo?: HTMLElement | null

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
  transportTo: HTMLElement | null | undefined

  position: PositionT

  updateOnAnimationFrame: boolean
  containerRef: Ref<HTMLDivElement>

  onReposition: (nodeRef: Element) => void
}
