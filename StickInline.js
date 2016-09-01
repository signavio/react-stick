// @flow

import React from 'react'
import defaultStyle from 'substyle'

import type { PropsT } from './flowTypes'

const StickInline = ({ node, children, position, ...rest }: PropsT) => (
  <div {...rest}>
    { children }
    <div {...substyle(rest, 'node')}>
      { node }
    </div>
  </div>
)

export default StickInline

const realSubstyle = defaultStyle({
  style: {
    position: 'relative',

    node: {
      position: 'absolute',
      zIndex: 99,

      '&top': {
        bottom: '100%',
      },
      '&middle': {
        top: '50%',
      },
      '&bottom': {
        top: '100%',
      },

      '&right': {
        left: '100%',
      },
      '&center': {
        left: '50%',
      },
      '&left': {
        right: '100%',
      },
    },
  },
}, ({ position = 'bottom left' }: PropsT) => {
  const [verticalPos, horizontalPos] = position.split(' ')
  return {
    [`&${verticalPos}`]: true,
    [`&${horizontalPos}`]: true,
  }
})

// workaround for babel bug: break up substyle chaining and return a plain object
const substyle = (...args) => ({
  ...realSubstyle(...args),
})

