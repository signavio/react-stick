// @flow
import React from 'react'
import useStyles from 'substyle'

import { type StickInlinePropsT } from './flowTypes'
import { getModifiers } from './utils'

function StickInline({
  node,
  children,
  component,
  containerRef,
  nestingKey,
  align,
  position,
  style,
  ...rest
}: StickInlinePropsT) {
  const styles = useStyles(
    defaultStyle,
    { style },
    getModifiers({ align, position })
  )
  const Component = component || 'div'
  return (
    <Component
      {...rest}
      {...styles}
      ref={containerRef}
      data-sticknestingkey={nestingKey}
    >
      {children}
      {node && <div {...styles('node')}>{node}</div>}
    </Component>
  )
}

const defaultStyle = {
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
}

export default StickInline
