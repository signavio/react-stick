// @flow
import 'requestidlecallback'
import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'
import { includes } from 'lodash'
import PropTypes from 'prop-types'
import { defaultStyle } from 'substyle'
import { omit, uniqueId, compact, some } from 'lodash'

import getModifiers from './getModifiers'
import getDefaultAlign from './getDefaultAlign'
import StickPortal from './StickPortal'
import StickInline from './StickInline'
import DEFAULT_POSITION from './defaultPosition'
import { scrollX } from './scroll'
import getBoundingClientRect from './getBoundingClientRect'
import type { PrivatePropsT, PositionT } from './flowTypes'

const PARENT_STICK_NESTING_KEY = 'react-stick__parentStickNestingKey'

const ContextTypes = {
  [PARENT_STICK_NESTING_KEY]: PropTypes.string,
}

type StateT = {
  width: ?number,
}

const PositionPropType = PropTypes.oneOf([
  'bottom left',
  'bottom center',
  'bottom right',
  'middle left',
  'middle center',
  'middle right',
  'top left',
  'top center',
  'top right',
])

class Stick extends Component<PrivatePropsT, StateT> {
  containerNestingKeyExtension: number
  containerNode: ?HTMLElement

  animationFrameId: ?AnimationFrameID
  idleCallbackId: ?IdleCallbackID

  static propTypes = {
    node: PropTypes.node,
    children: PropTypes.node,
    position: PositionPropType,
    align: PositionPropType,
    inline: PropTypes.bool,
    sameWidth: PropTypes.bool,
    updateOnAnimationFrame: PropTypes.bool,
    onClickOutside: PropTypes.func,
    transportTo: PropTypes.instanceOf(HTMLElement),
  }

  static contextTypes = ContextTypes
  static childContextTypes = ContextTypes

  static defaultProps = {
    position: DEFAULT_POSITION,
  }

  constructor(...args) {
    super(...args)
    this.containerNestingKeyExtension = uniqueId()
    this.state = {
      width: 0,
    }
  }

  componentDidMount() {
    document.addEventListener('click', this.handleClickOutside, true)
    this.startTracking()
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClickOutside, true)
    this.stopTracking()
  }

  getChildContext() {
    return {
      [PARENT_STICK_NESTING_KEY]: this.getNestingKey(),
    }
  }

  render() {
    const { inline, node, style, align, sameWidth, ...rest } = this.props
    const SpecificStick = inline ? StickInline : StickPortal
    const { style: wrapperStyle, ...wrapperStylingProps } = style('nodeWrapper')
    return (
      <SpecificStick
        {...omit(rest, 'onClickOutside')}
        node={
          node && (
            <div
              {...wrapperStylingProps}
              style={{
                ...wrapperStyle,
                width: wrapperStyle.width
                  ? wrapperStyle.width
                  : this.state.width,
              }}
            >
              <div {...style('nodeContent')}>{node}</div>
            </div>
          )
        }
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
      // Find all stick nodes nested inside our own stick node and check if the click
      // happened on any of these (our own stick node will also be part of the query result)
      const nestedStickNodes = document.querySelectorAll(
        `[data-stickNestingKey^='${nestingKey}']`
      )
      return !some(nestedStickNodes, stickNode => stickNode.contains(target))
    }

    return true
  }

  startTracking() {
    // do not track in node
    if (typeof window.requestAnimationFrame === 'undefined') return

    const callback = () => this.startTracking()
    if (this.props.updateOnAnimationFrame) {
      this.animationFrameId = requestAnimationFrame(callback)
    } else {
      this.idleCallbackId = requestIdleCallback(callback)
    }

    this.measure()
  }

  stopTracking() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId)
      this.animationFrameId = undefined
    }

    if (this.idleCallbackId) {
      cancelIdleCallback(this.idleCallbackId)
      this.idleCallbackId = undefined
    }
  }

  measure() {
    const boundingRect = getBoundingClientRect(this)

    const width = this.props.sameWidth
      ? boundingRect.width
      : calculateWidth(
          this.props.position,
          this.props.align || getDefaultAlign(this.props.position),
          boundingRect
        )

    if (width !== this.state.width) {
      this.setState({ width })
    }
  }
}

function calculateWidth(
  position: PositionT,
  align: PositionT,
  { left, width, right }: ClientRect
) {
  const scrollWidth = document.documentElement
    ? document.documentElement.scrollWidth
    : right // this should never be used in a browser env where documentElement will be available

  const absLeft =
    scrollX() +
    {
      left,
      center: left + width / 2,
      right,
    }[position.split(' ')[1]]

  if (includes(align, 'left')) {
    return scrollWidth - absLeft
  }

  if (includes(align, 'right')) {
    return absLeft
  }

  if (includes(align, 'center')) {
    return Math.min(absLeft, scrollWidth - absLeft) * 2
  }
}

const styled = defaultStyle(
  {
    node: {
      position: 'absolute',
      zIndex: 99,
      textAlign: 'left',
    },

    nodeWrapper: {
      position: 'absolute',
      right: 0,
      bottom: 0,
    },

    nodeContent: {
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
      nodeContent: {
        display: 'block',
        width: '100%',
      },
    },

    '&align-left': {
      nodeWrapper: {
        right: 'auto',
        left: 0,
      },
    },
    '&align-top': {
      nodeWrapper: {
        bottom: 'auto',
        top: 0,
      },
    },

    '&align-middle': {
      nodeContent: {
        transform: 'translate(0, 50%)',
      },
    },
    '&align-center': {
      nodeContent: {
        transform: 'translate(50%, 0)',
      },
      '&align-middle': {
        nodeContent: {
          transform: 'translate(50%, 50%)',
        },
      },
    },
  },
  getModifiers
)

export default styled(Stick)
