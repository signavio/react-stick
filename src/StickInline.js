// @flow
import React from 'react'
import { type HOC } from 'recompose'
import { type Substyle, defaultStyle } from 'substyle'

import { type StickInlinePropsT } from './flowTypes'
import { getModifiers } from './utils'

type PropsT = {|
  ...StickInlinePropsT,

  style: Substyle,
|}

function StickInline({
  node,
  children,
  style,
  component,
  containerRef,
  nestingKey,
  ...rest
}: PropsT) {
  const Component = component || 'div'
  return (
    <Component
      {...style}
      {...rest}
      ref={containerRef}
      data-sticknestingkey={nestingKey}
    >
      {children}
      {node && <div {...style('node')}>{node}</div>}
    </Component>
  )
}

const styled: HOC<*, StickInlinePropsT> = defaultStyle(
  {
    position: 'relative',

    node: {
      position: 'absolute',
      zIndex: 99,
      textAlign: 'left',
    },

    '&position-top': {
      node: {
        top: 0,
      },
    },
    '&position-middle': {
      node: {
        top: '50%',
      },
    },
    '&position-bottom': {
      node: {
        top: '100%',
      },
    },

    '&position-left': {
      node: {
        left: 0,
      },
    },
    '&position-center': {
      node: {
        left: '50%',
      },
    },
    '&position-right': {
      node: {
        left: '100%',
      },
    },
  },
  getModifiers
)

export default styled(StickInline)
