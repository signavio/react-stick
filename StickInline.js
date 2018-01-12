// @flow

import React from 'react'
import { defaultStyle } from 'substyle'
import { omit } from 'lodash'

import type { PropsT } from './flowTypes'

type FinalPropsT = PropsT & {
  nestingKey: string,
}

const StickInline = ({
  node,
  children,
  nodeWidth,
  style,
  containerRef,
  nestingKey,
  ...rest
}: FinalPropsT) => {
  const nodeStyle = {
    ...style('node').style,
    ...(nodeWidth != null && { width: nodeWidth }),
  }

  return (
    <div
      ref={containerRef}
      data-sticknestingkey={nestingKey}
      {...omit(rest, 'position', 'updateOnAnimationFrame')}
      {...style}
    >
      {children}
      {node &&
        <div {...style('node')} style={nodeStyle}>
          {node}
        </div>}
    </div>
  )
}

const getModifiers = ({ position = 'bottom left' }: FinalPropsT) => {
  const [verticalPos, horizontalPos] = position.split(' ')
  return {
    [`&position-${verticalPos}`]: true,
    [`&position-${horizontalPos}`]: true,
  }
}

const styled = defaultStyle(
  {
    position: 'relative',

    node: {
      position: 'absolute',
      zIndex: 99,
      width: '100%',
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
        left: 0,
      },
    },
  },
  getModifiers
)

export default styled(StickInline)
