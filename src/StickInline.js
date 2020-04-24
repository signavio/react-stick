// @flow
import React from 'react'
import { createUseStyle } from 'substyle'

import { type StickInlinePropsT } from './flowTypes'
import { getModifiers } from './utils'

function StickInline(props: StickInlinePropsT) {
  const style = useStyle((props: Object))
  const {
    node,
    children,
    component,
    containerRef,
    nestingKey,
    align,
    position,
    style: _style,
    ...rest
  } = props
  const Component = component || 'div'
  return (
    <Component
      {...rest}
      {...style}
      ref={containerRef}
      data-sticknestingkey={nestingKey}
    >
      {children}
      {node && <div {...style('node')}>{node}</div>}
    </Component>
  )
}

const useStyle = createUseStyle(
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

export default StickInline
