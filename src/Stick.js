// @flow

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { defaultStyle } from 'substyle'
import { omit, uniqueId, compact, flatten } from 'lodash'

import getModifiers from './getModifiers'
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

const verticals = ['top', 'middle', 'bottom']
const horizontals = ['left', 'center', 'right']

const aligns = flatten(
  verticals.map(vertical =>
    horizontals.map(horizontal => [vertical, horizontal])
  )
)

const translateX = (position, align) => {
  if (position === align) {
    return 0
  }

  const absoluteValue = position === 'center' || align === 'center' ? 50 : 100
  let factor = 1

  if (position === 'center' && align === 'right') {
    factor = -1
  }

  if (position === 'left') {
    factor = -1
  }

  return factor * absoluteValue
}

const translateY = align => {
  if (align === 'top') {
    return 0
  }

  if (align === 'middle') {
    return -50
  }

  return -100
}

const styled = defaultStyle(
  {
    nodeContent: {
      // absolute position is need as the sticked node would otherwise
      // cover up the base node and, for instance, make it impossible to
      // click buttons
      position: 'absolute',
      display: 'inline-block',
    },

    ...horizontals.reduce(
      (positionStyles, horizontalPosition) => ({
        ...positionStyles,

        [`&position-${horizontalPosition}`]: {
          ...aligns.reduce(
            (alignStyles, [verticalAlign, horizontalAlign]) => ({
              ...alignStyles,

              [`&align-${verticalAlign}-${horizontalAlign}`]: {
                nodeContent: {
                  transform: `translate(${translateX(
                    horizontalPosition,
                    horizontalAlign
                  )}%, ${translateY(verticalAlign)}%)`,
                },
              },
            }),
            {}
          ),
        },
      }),
      {}
    ),
  },
  getModifiers
)

export default styled(Stick)
