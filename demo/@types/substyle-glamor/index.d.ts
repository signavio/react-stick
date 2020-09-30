declare module 'substyle-glamor' {
  import { Component, ReactNode } from 'react'

  type EnhancerPropsT = {
    children: ReactNode
  }
  export function StylesAsDataAttributes(props: EnhancerPropsT): JSX.Element
}
