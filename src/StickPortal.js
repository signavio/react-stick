// @flow
import 'requestidlecallback'
import React, { Component } from 'react'
import PT from 'prop-types'
import { omit, includes } from 'lodash'
import { createPortal } from 'react-dom'

import { scrollX, scrollY } from './scroll'
import type { PositionT, PrivateSpecificPropsT } from './flowTypes'

const PORTAL_HOST_ELEMENT = 'react-stick__portalHostElement'

const ContextTypes = {
  [PORTAL_HOST_ELEMENT]: window ? PT.instanceOf(window.Element) : PT.any,
}

type PortalPropsT = {
  host: HTMLElement,
  children: React$Element<any>,
}

class Portal extends Component<PortalPropsT> {
  static childContextTypes = ContextTypes

  render() {
    const { host, children } = this.props
    return createPortal(children, host)
  }

  getChildContext() {
    return {
      [PORTAL_HOST_ELEMENT]: this.props.host.parentNode,
    }
  }
}

type StateT = {
  top: number,
  left: number,
  width: number,
}

class StickPortal extends Component<PrivateSpecificPropsT, StateT> {
  element: HTMLElement // the element whose position is tracked
  container: HTMLElement // the container for the stick node (has z-index)
  host: HTMLElement // the host element to which we portal the container (has no styles)

  animationFrameId: ?AnimationFrameID
  idleCallbackId: ?IdleCallbackID

  static contextTypes = ContextTypes

  state = {
    top: 0,
    left: 0,
  }

  constructor(props) {
    super(props)
    this.host = document.createElement('div')
  }

  componentDidMount() {
    if (this.props.node) {
      this.mountHost()
      this.startTracking()
    }
  }

  componentDidUpdate(prevProps: PrivateSpecificPropsT) {
    if (this.props.node && !prevProps.node) {
      this.mountHost()
      this.startTracking()
    }

    if (this.props.transportTo !== prevProps.transportTo && this.props.node) {
      // re-call mountHost, which will also move the node to the new host
      this.mountHost()
    }

    if (!this.props.node && prevProps.node) {
      this.stopTracking()
      this.unmountHost()
    }
  }

  componentWillUnmount() {
    if (this.host) {
      this.stopTracking()
      this.unmountHost()
    }
  }

  render() {
    const { children, style, anchorRef, ...rest } = this.props
    return (
      <div
        {...omit(
          rest,
          'node',
          'position',
          'updateOnAnimationFrame',
          'transportTo',
          'containerRef',
          'nestingKey'
        )}
        {...style}
        ref={(ref: HTMLElement) => {
          anchorRef(ref)
          this.element = ref
        }}
      >
        {children}
        {this.renderNode()}
      </div>
    )
  }

  renderNode() {
    const { node, style, nestingKey } = this.props
    const { style: nodeStyle, ...otherNodeStyleProps } = style('node')
    // Do not render `this.props.node` before the container ref is set. This ensures that
    // all descendant portals will be mounted to the right host element straight away.
    // We must not rely on context updates!
    return (
      <Portal host={this.host}>
        <div
          ref={this.storeContainerRef}
          data-sticknestingkey={nestingKey}
          {...otherNodeStyleProps}
          style={{
            position: 'absolute',
            ...nodeStyle,
            ...this.state,
          }}
        >
          {this.container && node}
        </div>
      </Portal>
    )
  }

  storeContainerRef = (ref: HTMLElement) => {
    const { containerRef } = this.props

    if (containerRef) {
      containerRef(ref)
    }

    if (this.container !== ref) {
      this.container = ref
      this.forceUpdate()
    }
  }

  mountHost() {
    const hostParent =
      this.props.transportTo ||
      this.context[PORTAL_HOST_ELEMENT] ||
      document.body
    if (hostParent) {
      hostParent.appendChild(this.host)
    }
  }

  unmountHost() {
    if (this.host.parentNode) {
      this.host.parentNode.removeChild(this.host)
    }
  }

  startTracking() {
    if (typeof window.requestAnimationFrame === 'undefined') {
      // do not track in node
      return
    }

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
    const boundingRect = this.element.getBoundingClientRect()
    const isFixed = hasFixedAncestors(this.element)

    const newStyle = {
      top: calculateTop(this.props.position, boundingRect, isFixed),
      left: calculateLeft(this.props.position, boundingRect, isFixed),
    }

    if (!stylesEqual(newStyle, this.state)) {
      this.setState(newStyle)
    }
  }
}

export default StickPortal

function calculateTop(
  position: PositionT,
  { top, height, bottom }: ClientRect,
  isFixed: boolean
) {
  let result = 0
  if (includes(position, 'top')) {
    result = top
  }
  if (includes(position, 'middle')) {
    result = top + height / 2
  }
  if (includes(position, 'bottom')) {
    result = bottom
  }
  return result + (isFixed ? 0 : scrollY())
}

function calculateLeft(
  position: PositionT,
  { left, width, right }: ClientRect,
  isFixed: boolean
) {
  let result = 0
  if (includes(position, 'left')) {
    result = left
  }
  if (includes(position, 'center')) {
    result = left + width / 2
  }
  if (includes(position, 'right')) {
    result = right
  }
  return result + (isFixed ? 0 : scrollX())
}

function hasFixedAncestors(element: HTMLElement) {
  let elem = element
  do {
    if (getComputedStyle(elem).position === 'fixed') return true
  } while ((elem = elem.offsetParent))
  return false
}

function stylesEqual(style1 = {}, style2 = {}) {
  return style1.left === style2.left && style1.top === style2.top
}
