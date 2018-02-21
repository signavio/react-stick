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
  containerRef,
  anchorRef,
  nestingKey,
  ...rest
}: PrivateSpecificPropsT) => (
  <div
    ref={ref => {
      containerRef(ref)
      anchorRef(ref)
    }}
    data-sticknestingkey={nestingKey}
    {...omit(rest, 'position', 'updateOnAnimationFrame')}
    {...style}
  >
    {children}
    {node && <div {...style('node')}>{node}</div>}
  </div>
)

const styled = defaultStyle(
  {
    position: 'relative',

    node: {
      position: 'absolute',
      zIndex: 99,
      width: '100%',
      textAlign: 'left',
      display: 'flex',
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
        justifyContent: 'flex-end',
      },
    },
    '&position-center': {
      node: {
        justifyContent: 'center',
      },
    },
  },
  getModifiers
)

export default styled(StickInline)
