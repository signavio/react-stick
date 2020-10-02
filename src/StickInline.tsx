import React, { Ref, createElement, forwardRef } from 'react'
import useStyles from 'substyle'

import { AllowedContainers, StickInlinePropsT } from './types'
import { getModifiers } from './utils'

function StickInline<T extends AllowedContainers>(
  {
    node,
    children,
    component,
    nestingKey,
    align,
    position,
    style,
    ...rest
  }: StickInlinePropsT<T>,
  ref: Ref<HTMLElement>
) {
  const styles = useStyles(
    defaultStyle,
    { style },
    getModifiers({ align, position })
  )

  return createElement(
    component,
    {
      ...rest,
      ...styles,
      ref,
      'data-sticknestingkey': nestingKey,
    },
    children,
    node ? <div {...styles('node')}>{node}</div> : null
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

export default forwardRef(StickInline)
