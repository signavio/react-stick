// @flow

import React from 'react'
import defaultStyle from 'substyle'
import { omit } from 'lodash'

import radium from '../../radium'
import type { PropsT } from './flowTypes'

const StickInline = ({ node, children, ...rest }: PropsT) => (
  <div {...omit(rest, 'position')} {...substyle(rest, getModifiers)(rest)}>
    { children }
    <div {...substyle(rest, getModifiers)(rest, 'node')}>
      { node }
    </div>
  </div>
)

export default radium(StickInline)

const substyle = defaultStyle({
  style: {
    position: 'relative',
    display: 'inline-block',

    node: {
      position: 'absolute',
      zIndex: 99,
    },

    '&position-top': {
      node: {
        bottom: '100%',
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

    '&position-right': {
      node: {
        left: '100%',
      },
    },
    '&position-center': {
      node: {
        left: '50%',
      },
    },
    '&position-left': {
      node: {
        right: '100%',
      },
    },
  },
})

const getModifiers = ({ position = 'bottom left' }: PropsT) => {
  const [verticalPos, horizontalPos] = position.split(' ')
  return {
    [`&position-${verticalPos}`]: true,
    [`&position-${horizontalPos}`]: true,
  }
}
