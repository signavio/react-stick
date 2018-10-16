// @flow
import 'requestidlecallback'
import React, { Component, type Node } from 'react'
import { findDOMNode } from 'react-dom'
import { includes } from 'lodash'
import PropTypes from 'prop-types'
import { defaultStyle } from 'substyle'
import { omit, uniqueId, compact, some } from 'lodash'
import { compose, type HOC } from 'recompose'
import { type Substyle } from 'substyle'

import { getModifiers, getBoundingClientRect, scrollX } from './utils'

import { type PositionT, type AlignT } from './flowTypes'
import { autoPositionHandling } from './higher-order'

import StickPortal from './StickPortal'
import StickInline from './StickInline'

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

type StickBasePropsT = {
  sameWidth?: boolean,
  inline?: boolean,

  autoFlipVertically?: boolean,
  autoFlipHorizontally?: boolean,

  updateOnAnimationFrame?: boolean,

  node: Node,
  children: Node,

  onClickOutside?: (ev: MouseEvent) => void,
}

type ApiPropsT = StickBasePropsT & {
  position?: PositionT,
  align?: AlignT,

  style?: Substyle,
}

type PropsT = StickBasePropsT & {
  position: PositionT,
  align: AlignT,

  style: Substyle,

  onFlipHorizontallyIfNeeded: (
    nodeRef: HTMLElement,
    anchorRef: HTMLElement
  ) => void,
  onFlipVerticallyIfNeeded: (
    nodeRef: HTMLElement,
    anchorRef: HTMLElement
  ) => void,
}

class Stick extends Component<PropsT, StateT> {
  containerNestingKeyExtension: string
  containerNode: ?HTMLElement
  nodeRef: ?HTMLElement

  animationFrameId: ?AnimationFrameID
  idleCallbackId: ?IdleCallbackID

  static propTypes = {
    node: PropTypes.node,
    position: PositionPropType,
    align: PositionPropType,
    inline: PropTypes.bool,
    sameWidth: PropTypes.bool,
    updateOnAnimationFrame: PropTypes.bool,
    onClickOutside: PropTypes.func,
  }

  static contextTypes = ContextTypes
  static childContextTypes = ContextTypes

  constructor(props) {
    super(props)
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
    const { inline, node, style, sameWidth, children, ...rest } = this.props
    const { width } = this.state
    const SpecificStick = inline ? StickInline : StickPortal

    const { style: wrapperStyle = {}, ...wrapperStylingProps } = style(
      'nodeWrapper'
    )

    return (
      <SpecificStick
        {...omit(
          rest,
          'initialPosition',
          'autoFlipVertically',
          'autoFlipHorizontally',
          'onFlipVerticallyIfNeeded',
          'onFlipHorizontallyIfNeeded',
          'onClickOutside'
        )}
        node={
          node && (
            <div
              {...wrapperStylingProps}
              style={{
                ...wrapperStyle,
                width: wrapperStyle.width ? wrapperStyle.width : width,
              }}
            >
              <div {...style('nodeContent')} ref={ref => (this.nodeRef = ref)}>
                {node}
              </div>
            </div>
          )
        }
        style={style}
        nestingKey={this.getNestingKey()}
        containerRef={this.setContainerRef}
      >
        {children}
      </SpecificStick>
    )
  }

  setContainerRef = (ref: ?HTMLElement) => {
    this.containerNode = ref
  }

  getNestingKey() {
    return compact([
      this.context[PARENT_STICK_NESTING_KEY],
      this.containerNestingKeyExtension,
    ]).join('_')
  }

  handleClickOutside = (ev: MouseEvent) => {
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
    const {
      position,
      align,
      sameWidth,
      autoFlipVertically,
      autoFlipHorizontally,
      onFlipVerticallyIfNeeded,
      onFlipHorizontallyIfNeeded,
    } = this.props
    const { width } = this.state

    const boundingRect = getBoundingClientRect(this)

    const newWidth = sameWidth
      ? boundingRect.width
      : calculateWidth(position, align, boundingRect)

    if (newWidth !== width) {
      this.setState({ width: newWidth })
    }

    const anchorRef = findDOMNode(this)

    if (!this.nodeRef || !anchorRef) {
      return
    }

    if (!(anchorRef instanceof HTMLElement)) {
      return
    }

    if (autoFlipVertically) {
      onFlipVerticallyIfNeeded(this.nodeRef, anchorRef)
    }

    if (autoFlipHorizontally) {
      onFlipHorizontallyIfNeeded(this.nodeRef, anchorRef)
    }
  }
}

function calculateWidth(
  position: PositionT,
  align: AlignT,
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

const enhance: HOC<*, ApiPropsT> = compose(
  autoPositionHandling,
  defaultStyle(
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
)

export default enhance(Stick)
