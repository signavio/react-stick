import type { LegacyRef, MutableRefObject, ReactNode } from "react";
import type { StylingProps, Substyle } from "substyle";

export type VerticalTargetT = "bottom" | "middle" | "top";
export type HorizontalTargetT = "left" | "center" | "right";

export type PositionT =
  | "bottom left"
  | "bottom center"
  | "bottom right"
  | "middle left"
  | "middle center"
  | "middle right"
  | "top left"
  | "top center"
  | "top right";

export type AlignT = PositionT;

export type StickPropsT = {
  position?: PositionT;
  align?: AlignT;
  inline?: boolean;
  sameWidth?: boolean;
  autoFlipVertically?: boolean;
  autoFlipHorizontally?: boolean;
  updateOnAnimationFrame?: boolean;
  component?: string;
  transportTo?: HTMLElement;
  node?: ReactNode | null;
  children: ReactNode;
  onClickOutside?: (ev: MouseEvent) => void;
} & StylingProps & React.HTMLAttributes<HTMLElement>;

type SpecificStickBasePropsT = {
  children: ReactNode;
  node?: ReactNode | null;
  component?: string | null;
  style: Substyle;
  nestingKey: string;
  containerRef?: LegacyRef<HTMLElement>;
};

export type StickInlinePropsT = {
  position: PositionT;
  align: AlignT;
} & SpecificStickBasePropsT;

export type StickPortalPropsT = {
  transportTo?: HTMLElement | null;
  position: PositionT;
  updateOnAnimationFrame: boolean;
  onReposition: (nodeRef: HTMLElement) => void;
} & SpecificStickBasePropsT;
