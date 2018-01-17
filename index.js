// @flow

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { defaultStyle } from 'substyle'
import { omit, uniqueId, compact } from 'lodash'

import StickPortal from './StickPortal'
import StickInline from './StickInline'
import type { PropsT } from './flowTypes'

const ContextTypes = {
  parentStickNestingKey: PropTypes.string,
}

class Stick extends Component<PropsT> {
  containerNestingKeyExtension: number

  static contextTypes = ContextTypes
  static childContextTypes = ContextTypes

  constructor(...args) {
    super(...args)
    this.containerNestingKeyExtension = uniqueId()
  }

  render() {
    const { inline, node, style, ...rest } = this.props

    const wrappedNode =
      node &&
      <div {...style('nodeContent')}>
        {node}
      </div>

    return inline
      ? <StickInline
          node={wrappedNode}
          {...omit(rest, 'align')}
          style={style}
          nestingKey={this.getNestingKey()}
        />
      : <StickPortal
          node={wrappedNode}
          {...omit(rest, 'align')}
          style={style}
          nestingKey={this.getNestingKey()}
        />
  }

  getChildContext() {
    return {
      parentStickNestingKey: this.getNestingKey(),
    }
  }

  getNestingKey() {
    return compact([
      this.context.parentStickNestingKey,
      this.containerNestingKeyExtension,
    ]).join('_')
  }
}

const getDefaultAlign = (position: string) =>
  position
    .split(' ')
    .map(
      (positionPart: string) =>
        ({
          top: 'bottom',
          middle: 'middle',
          bottom: 'top',
          left: position.indexOf('middle') ? 'left' : 'right',
          center: 'center',
          right: position.indexOf('middle') ? 'right' : 'left',
        }[positionPart])
    )
    .join(' ')

const getModifiers = ({ align, position = 'bottom left' }: PropsT) => {
  const [verticalAlign, horizontalAlign] = (align || getDefaultAlign(position))
    .split(' ')
  return {
    [`&align-${verticalAlign}`]: true,
    [`&align-${horizontalAlign}`]: true,
  }
}

const styled = defaultStyle(
  {
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
        transform: 'translateX(-100%)',
      },

      '&align-middle': {
        nodeContent: {
          transform: 'translateX(-100%) translateY(-50%)',
        },
      },
    },
  },
  getModifiers
)

export default styled(Stick)
