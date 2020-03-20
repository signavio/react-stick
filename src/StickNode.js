// @flow
import React, { type Node } from 'react'
import { type HOC } from 'recompose'
import { type Substyle, defaultStyle } from 'substyle'

import { type AlignT, type PositionT, type RefT } from './flowTypes'
import { getModifiers } from './utils'

type ApiPropsT = {|
  width: number,

  position: PositionT,
  align: AlignT,
  sameWidth: boolean,

  children: Node,

  nodeRef: RefT,
|}

type PropsT = {|
  ...ApiPropsT,

  style: Substyle,
|}

function StickNode({ style, children, nodeRef }: PropsT) {
  return (
    <div {...style}>
      <div {...style('content')} ref={nodeRef}>
        {children}
      </div>
    </div>
  )
}

const styled: HOC<*, ApiPropsT> = defaultStyle(
  ({ width }) => ({
    position: 'absolute',
    right: 0,
    bottom: 0,

    width,

    content: {
      // absolute position is needed as the stick node would otherwise
      // cover up the base node and, for instance, make it impossible to
      // click buttons
      position: 'absolute',
      display: 'inline-block',

      left: 'inherit',
      right: 'inherit',
      top: 'inherit',
      bottom: 'inherit',
    },

    '&sameWidth': {
      content: {
        display: 'block',
        width: '100%',
      },
    },

    '&align-left': {
      right: 'auto',
      left: 0,
    },
    '&align-top': {
      bottom: 'auto',
      top: 0,
    },

    '&align-middle': {
      content: {
        transform: 'translate(0, 50%)',
      },
    },
    '&align-center': {
      content: {
        transform: 'translate(50%, 0)',
      },
      '&align-middle': {
        content: {
          transform: 'translate(50%, 50%)',
        },
      },
    },
  }),
  getModifiers
)

export default styled(StickNode)
