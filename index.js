// @flow

import React from 'react'
import defaultStyle from 'substyle'
import { omit } from 'lodash'

import StickPortal from './StickPortal'
import StickInline from './StickInline'
import type { PropsT } from './flowTypes'

const Stick = ({ inline, node, ...rest }: PropsT) => {
  const SpecificStick = inline ? StickInline : StickPortal
  const modifiedSubstyle = substyle(rest, getModifiers)
  return (
    <SpecificStick
      node={
        <div {...modifiedSubstyle(rest, 'nodeContent')}>
          { node }
        </div>
      }
      {...omit(rest, 'align')}
    />
  )
}

const substyle = defaultStyle({
  style: {

    nodeContent: {
      display: 'inline-block',
      position: 'absolute',
    },

    '&align-middle': {
      nodeContent: {
        transform: 'translateY(-50%)',
      },
    },
    '&align-bottom': {
      nodeContent: {
        bottom: '100%',
      },
    },
    '&align-center': {
      nodeContent: {
        transform: 'translateX(-50%)',
      },

      '&align-middle': {
        nodeContent: {
          transform: 'translateX(-50%) translateY(-50%)',
        },
      },
    },
    '&align-right': {
      nodeContent: {
        right: '100%',
      },
    },
  },
})

const getDefaultAlign = (position: string) => (
  position.split(' ').map((positionPart: string) => ({
    top: 'bottom',
    middle: 'middle',
    bottom: 'top',
    left: position.indexOf('middle') ? 'left' : 'right',
    center: 'center',
    right: position.indexOf('middle') ? 'right' : 'left',
  })[positionPart]).join(' ')
)

const getModifiers = ({ align, position = 'bottom left' }: PropsT) => {
  const [verticalAlign, horizontalAlign] = (align || getDefaultAlign(position)).split(' ')
  return {
    [`&align-${verticalAlign}`]: true,
    [`&align-${horizontalAlign}`]: true,
  }
}

// workaround for babel bug: break up substyle chaining and return a plain object
// const substyle = (...args) => ({
//   ...realSubstyle(...args),
// })

export default Stick
