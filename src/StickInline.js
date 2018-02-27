// @flow

import React from 'react'
import { defaultStyle } from 'substyle'
import { omit } from 'lodash'

import getModifiers from './getModifiers'
import type { PrivateSpecificPropsT } from './flowTypes'

const StickInline = ({
  node,
  children,
  style,
  component,
  containerRef,
  nestingKey,
  ...rest
}: PrivateSpecificPropsT) => {
  const Comp = component || 'div'
  return (
    <Comp
      ref={ref => {
        containerRef(ref)
      }}
      data-sticknestingkey={nestingKey}
      {...omit(rest, 'position', 'updateOnAnimationFrame')}
      {...style}
    >
      {children}
      {node && <div {...style('node')}>{node}</div>}
    </Comp>
  )
}

const styled = defaultStyle(
  {
    position: 'relative',

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
