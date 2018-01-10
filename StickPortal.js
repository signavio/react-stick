// @flow

import 'requestidlecallback'
import React, { Component } from 'react'
import { omit } from 'lodash'
import { createPortal } from 'react-dom'
import { defaultStyle } from 'substyle'

import PortalHostElementContextTypes from '../portalHostElementContextTypes'
import type { PositionT, PropsT } from './flowTypes'

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

declare function requestAnimationFrame(func: Function): number
declare function cancelAnimationFrame(id: number): void
declare function requestIdleCallback(func: Function): number
declare function cancelIdleCallback(id: number): void

const Portal = ({ host, containerRef, children, ...rest }) =>
  createPortal(
    <div ref={containerRef} {...rest}>
      {children}
    </div>,
    host
  )

class StickPortal extends Component<FinalPropsT, StateT> {
  element: ?HTMLElement // the element whose position is tracked
  container: ?HTMLElement // the container for the sticked node (has z-index)
  host: ?HTMLElement // the host element to which we portal the container (has no styles)

  animationId: number
  lastCallbackAsAnimationFrame: boolean

  static contextTypes = PortalHostElementContextTypes
  static childContextTypes = PortalHostElementContextTypes

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

  getChildContext() {
    return {
      portalHostElement: this.container,
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
    const { node, style, nestingKey, nodeWidth } = this.props
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
      this.props.transportTo || this.context.portalHostElement || document.body
    hostParent.appendChild(this.host)
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
    const newStyle = calculateStyle(this.props.position, this.element)
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
  ({ position = 'bottom left' }: PropsT) => {
    const [verticalPos, horizontalPos] = position.split(' ')
    return {
      [`&${verticalPos}`]: true,
      [`&${horizontalPos}`]: true,
    }
  }
)

export default styled(StickPortal)

function calculateStyle(position: ?PositionT, element: HTMLElement) {
  switch (position) {
    case 'top left':
      return topLeft(element)
    case 'top right':
      return topRight(element)
    case 'top center':
      return topCenter(element)
    case 'bottom center':
      return bottomCenter(element)
    case 'bottom right':
      return bottomRight(element)
    case 'middle right':
      return middleRight(element)
    case 'middle center':
      return middleCenter(element)
    case 'middle left':
      return middleLeft(element)
    case 'bottom left':
    default:
      return bottomLeft(element)
  }
}

function hasFixedAncestors(element: HTMLElement) {
  let elem = element
  do {
    if (getComputedStyle(elem).position == 'fixed') return true
  } while ((elem = elem.offsetParent))
  return false
}

function topLeft(element: HTMLElement) {
  const { width, left, top } = element.getBoundingClientRect()
  const isFixed = hasFixedAncestors(element)
  return {
    width,
    left: left + (isFixed ? 0 : scrollX()),
    top: top + (isFixed ? 0 : scrollY()),
  }
}

function topRight(element: HTMLElement) {
  const { width, right, top } = element.getBoundingClientRect()
  const isFixed = hasFixedAncestors(element)
  return {
    width,
    left: right + (isFixed ? 0 : scrollX()),
    top: top + (isFixed ? 0 : scrollY()),
  }
}

function topCenter(element: HTMLElement) {
  const { width, left, top } = element.getBoundingClientRect()
  const isFixed = hasFixedAncestors(element)
  return {
    width,
    left: left + width / 2 + (isFixed ? 0 : scrollX()),
    top: top + (isFixed ? 0 : scrollY()),
  }
}

function bottomLeft(element: HTMLElement) {
  const { width, left, bottom } = element.getBoundingClientRect()
  const isFixed = hasFixedAncestors(element)
  return {
    width,
    left: left + (isFixed ? 0 : scrollX()),
    top: bottom + (isFixed ? 0 : scrollY()),
  }
}

function bottomRight(element: HTMLElement) {
  const { width, right, bottom } = element.getBoundingClientRect()
  const isFixed = hasFixedAncestors(element)
  return {
    width,
    left: right + (isFixed ? 0 : scrollX()),
    top: bottom + (isFixed ? 0 : scrollY()),
  }
}

function bottomCenter(element: HTMLElement) {
  const { width, left, bottom } = element.getBoundingClientRect()
  const isFixed = hasFixedAncestors(element)
  return {
    width,
    left: left + width / 2 + (isFixed ? 0 : scrollX()),
    top: bottom + (isFixed ? 0 : scrollY()),
  }
}

function middleRight(element: HTMLElement) {
  const { width, height, right, top } = element.getBoundingClientRect()
  const isFixed = hasFixedAncestors(element)
  return {
    width,
    left: right + (isFixed ? 0 : scrollX()),
    top: top + height / 2 + (isFixed ? 0 : scrollY()),
  }
}

function middleCenter(element: HTMLElement) {
  const { width, height, left, top } = element.getBoundingClientRect()
  const isFixed = hasFixedAncestors(element)
  return {
    width,
    left: left + width / 2 + (isFixed ? 0 : scrollX()),
    top: top + height / 2 + (isFixed ? 0 : scrollY()),
  }
}

function middleLeft(element: HTMLElement) {
  const { width, height, left, top } = element.getBoundingClientRect()
  const isFixed = hasFixedAncestors(element)
  return {
    width,
    left: left + (isFixed ? 0 : scrollX()),
    top: top + height / 2 + (isFixed ? 0 : scrollY()),
  }
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
    return document.documentElement.scrollTop
  }

  if (
    typeof document !== 'undefined' &&
    typeof document.body !== 'undefined' &&
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
    return document.documentElement.scrollLeft
  }

  if (
    typeof document !== 'undefined' &&
    typeof document.body !== 'undefined' &&
    typeof document.body.scrollLeft === 'number'
  ) {
    return document.body.scrollLeft
  }

  return 0
}
