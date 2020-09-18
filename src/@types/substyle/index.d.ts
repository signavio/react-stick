type PlainStyleT = {
  [string]: string | number
}

type StyleT = {
  [string]: string | number | StyleT
}

type ClassNamesT = {
  [string]: string
}

type ModifiersT = {
  [string]: boolean
}

declare module 'substyle' {
  export type StylingProps = {
    style?: StyleT | Substyle
    className?: string
    classNames?: ClassNamesT
  }

  export type Substyle = {
    (select: KeysT, defaultStyle?: StyleT): SubstyleT

    style?: PlainStyleT
    className?: string
  }

  export function inline(base: Substyle, styles: StyleT): Substyle

  function useStyles(
    defaultStyle: void | StyleT,
    stylingProps: StylingProps,
    modifiers?: ModifiersT
  ): Substyle

  export = useStyles
}
