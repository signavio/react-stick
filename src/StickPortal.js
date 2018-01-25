// @flow

import 'requestidlecallback'
import React, { Component } from 'react'
import PT from 'prop-types'
import { omit, includes } from 'lodash'
import { createPortal } from 'react-dom'
import { defaultStyle } from 'substyle'

import getModifiers from './getModifiers'
import type { PositionT, PropsT } from './flowTypes'

declare function requestAnimationFrame(func: Function): number
declare function cancelAnimationFrame(id: number): void
declare function requestIdleCallback(func: Function): number
declare function cancelIdleCallback(id: number): void

const PORTAL_HOST_ELEMENT = 'react-stick__portalHostElement'

const ContextTypes = {
  [PORTAL_HOST_ELEMENT]: window ? PT.instanceOf(window.Element) : PT.any,
}

type PortalPropsT = {
  host: HTMLElement,
  containerRef: (element: HTMLElement | null) => void,
  children?: React$Element<any>,
}

class Portal extends Component<PortalPropsT> {
  static childContextTypes = ContextTypes

  render() {
    const { host, containerRef, children, ...rest } = this.props

    return createPortal(
      <div ref={containerRef} {...rest}>
        {children}
      </div>,
      host
    )
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

type FinalPropsT = PropsT & {
  nestingKey: string,
  transportTo?: HTMLElement,
  updateOnAnimationFrame?: boolean,
}

class StickPortal extends Component<FinalPropsT, StateT> {
  element: HTMLElement // the element whose position is tracked
  container: HTMLElement // the container for the sticked node (has z-index)
  host: HTMLElement // the host element to which we portal the container (has no styles)

  animationId: number
  lastCallbackAsAnimationFrame: ?boolean

  static contextTypes = ContextTypes

  static defaultProps = {
    position: 'bottom left',
  }

  state = {
    top: 0,
    left: 0,
    width: 0,
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

  componentDidUpdate(prevProps: FinalPropsT) {
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
    const { children, style, ...rest } = this.props
    return (
      <div
        {...omit(
          rest,
          'node',
          'position',
          'nodeWidth',
          'updateOnAnimationFrame',
          'transportTo',
          'containerRef',
          'nestingKey'
        )}
        {...style}
        ref={(ref: HTMLElement) => {
          this.element = ref
        }}
      >
        {children}
        {this.renderNode()}
      </div>
    )
  }

  renderNode() {
    const { node, style, nestingKey, nodeWidth, position } = this.props

    // Do not render `this.props.node` before the container ref is set. This ensures that
    // all descendant portals will be mounted to the right host element straight away.
    // We must not rely on context updates!
    return (
      <Portal
        {...style('node')}
        host={this.host}
        containerRef={this.storeContainerRef}
        data-sticknestingkey={nestingKey}
      >
        <div
          style={{
            position: 'absolute',
            display: 'flex',
            justifyContent: calculateJustifyContent(position),
            ...this.state,
            ...(nodeWidth != null ? { width: nodeWidth } : {}),
          }}
        >
          {this.container && node}
        </div>
      </Portal>
    )
  }

  storeContainerRef = (ref: HTMLElement) => {
    const { containerRef } = this.props

    if (this.container !== ref) {
      this.container = ref
      this.forceUpdate()
    }

    if (containerRef) {
      containerRef(ref)
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

    const requestCallback = this.props.updateOnAnimationFrame
      ? requestAnimationFrame
      : requestIdleCallback
    this.lastCallbackAsAnimationFrame = this.props.updateOnAnimationFrame

    this.animationId = requestCallback(() => this.startTracking())
    this.measure()
  }

  stopTracking() {
    const cancelCallback = this.lastCallbackAsAnimationFrame
      ? cancelAnimationFrame
      : cancelIdleCallback
    cancelCallback(this.animationId)
  }

  measure() {
    const boundingRect = this.element.getBoundingClientRect()
    const isFixed = hasFixedAncestors(this.element)

    const newStyle = {
      width: boundingRect.width,

      top: calculateTop(this.props.position, boundingRect, isFixed),
      left: boundingRect.left + (isFixed ? 0 : scrollX()),
    }

    if (!stylesEqual(newStyle, this.state)) {
      this.setState(newStyle)
    }
  }
}

const styled = defaultStyle(
  {
    node: {
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 99,
      width: '100%',
    },
  },
  getModifiers
)

export default styled(StickPortal)

function calculateTop(
  position: ?PositionT,
  { top, height, bottom },
  isFixed: boolean
) {
  if (includes(position, 'top')) {
    return top + (isFixed ? 0 : scrollY())
  }

  if (includes(position, 'middle')) {
    return top + height / 2 + (isFixed ? 0 : scrollY())
  }

  return bottom + (isFixed ? 0 : scrollY())
}

function calculateJustifyContent(position: ?PositionT) {
  if (includes(position, 'right')) {
    return 'flex-end'
  }

  if (includes(position, 'center')) {
    return 'center'
  }

  return 'flex-start'
}

function hasFixedAncestors(element: HTMLElement) {
  let elem = element
  do {
    if (getComputedStyle(elem).position == 'fixed') return true
  } while ((elem = elem.offsetParent))
  return false
}

function stylesEqual(style1 = {}, style2 = {}) {
  return (
    style1.width === style2.width &&
    style1.left === style2.left &&
    style1.top === style2.top
  )
}

/*
 * Don't believe me dog?
 * ok.
 * https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollY#Notes
 */
const hasPageOffset =
  typeof window !== 'undefined' && typeof window.pageXOffset !== 'undefined'

const compatMode =
  typeof document !== 'undefined' && typeof document.compatMode === 'string'
    ? document.compatMode
    : ''

function scrollY() {
  if (typeof window !== 'undefined' && typeof window.scrollY === 'number') {
    return window.scrollY
  }

  if (hasPageOffset === true) {
    return window.pageYOffset
  }

  if (compatMode === 'CSS1Compat') {
    return document.documentElement && document.documentElement.scrollTop
  }

  if (
    typeof document !== 'undefined' &&
    !!document.body &&
    typeof document.body.scrollTop === 'number'
  ) {
    return document.body.scrollTop
  }

  return 0
}

function scrollX() {
  if (typeof window !== 'undefined' && typeof window.scrollX === 'number') {
    return window.scrollX
  }

  if (hasPageOffset === true) {
    return window.pageXOffset
  }

  if (compatMode === 'CSS1Compat') {
    return document.documentElement && document.documentElement.scrollLeft
  }

  if (
    typeof document !== 'undefined' &&
    !!document.body &&
    typeof document.body.scrollLeft === 'number'
  ) {
    return document.body.scrollLeft
  }

  return 0
}
