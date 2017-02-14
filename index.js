// @flow

import React from 'react'
import { defaultStyle } from 'substyle'
import { omit } from 'lodash'

import StickPortal from './StickPortal'
import StickInline from './StickInline'
import type { PropsT } from './flowTypes'

const Stick = ({ inline, node, style, ...rest }: PropsT) => {
  const SpecificStick = inline ? StickInline : StickPortal
  return (
    <SpecificStick
      node={
        <div {...style('nodeContent')}>
          { node }
        </div>
      }
      {...omit(rest, 'align')}
      style={style}
    />
  )
}

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

const styled = defaultStyle({
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
}, getModifiers)

export default styled(Stick)
