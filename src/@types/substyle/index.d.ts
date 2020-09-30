declare module 'substyle' {
  type PlainStyleT = {
    [key: string]: string | number
  }

  type StyleT = {
    [key: string]: string | number | StyleT
  }

  type ClassNamesT = {
    [key: string]: string
  }

  type ModifiersT = {
    [key: string]: boolean
  }

  type KeysT = string | Array<string> | ModifiersT

  namespace useStyles {
    export type StylingProps = {
      style?: StyleT | Substyle
      className?: string
      classNames?: ClassNamesT
    }

    export type Substyle = {
      (select: KeysT, defaultStyle?: StyleT): Substyle

      style?: PlainStyleT
      className?: string
    }

    export function inline(base: Substyle, styles: StyleT): Substyle
  }

  function useStyles(
    defaultStyle: void | StyleT,
    stylingProps: useStyles.StylingProps,
    modifiers?: ModifiersT
  ): useStyles.Substyle

  export = useStyles
}
