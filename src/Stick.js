// @flow

import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'
import PropTypes from 'prop-types'
import { defaultStyle } from 'substyle'
import { omit, uniqueId, compact, flatten, some } from 'lodash'

import getModifiers from './getModifiers'
import StickPortal from './StickPortal'
import StickInline from './StickInline'
import type { PropsT } from './flowTypes'

const PARENT_STICK_NESTING_KEY = 'react-stick__parentStickNestingKey'

const ContextTypes = {
  [PARENT_STICK_NESTING_KEY]: PropTypes.string,
}

class Stick extends Component<PropsT> {
  containerNestingKeyExtension: number
  containerNode: ?HTMLElement

  static contextTypes = ContextTypes
  static childContextTypes = ContextTypes

  constructor(...args) {
    super(...args)
    this.containerNestingKeyExtension = uniqueId()
  }

  componentDidMount() {
    document.addEventListener('click', this.handleClickOutside, true)
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClickOutside, true)
  }

  getChildContext() {
    return {
      [PARENT_STICK_NESTING_KEY]: this.getNestingKey(),
    }
  }

  render() {
    const { inline, node, style, ...rest } = this.props
    const SpecificStick = inline ? StickInline : StickPortal

    return (
      <SpecificStick
        {...omit(rest, 'align', 'onClickOutside')}
        node={node && <div {...style('nodeContent')}>{node}</div>}
        style={style}
        nestingKey={this.getNestingKey()}
        containerRef={this.setContainerRef}
      />
    )
  }

  setContainerRef = (ref: HTMLElement | null) => {
    this.containerNode = ref
  }

  getNestingKey() {
    return compact([
      this.context[PARENT_STICK_NESTING_KEY],
      this.containerNestingKeyExtension,
    ]).join('_')
  }

  handleClickOutside = (ev: Event) => {
    const { onClickOutside } = this.props
    if (!onClickOutside) {
      return
    }

    const { target } = ev
    if (target instanceof window.HTMLElement && this.isOutside(target)) {
      onClickOutside(ev)
    }
  }

  isOutside(target: HTMLElement) {
    const anchorNode = findDOMNode(this)
    if (anchorNode && anchorNode.contains(target)) {
      return false
    }

    const nestingKey =
      this.containerNode &&
      this.containerNode.getAttribute('data-sticknestingkey')

    if (nestingKey) {
      // Find all sticked nodes nested inside our own sticked node and check if the click
      // happened on any of these (our own sticked node will also be part of the query result)
      const nestedStickNodes = document.querySelectorAll(
        `[data-stickNestingKey^='${nestingKey}']`
      )
      return !some(nestedStickNodes, stickNode => stickNode.contains(target))
    }

    return true
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
