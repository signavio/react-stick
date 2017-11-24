// @flow

import 'requestidlecallback'
import React, { Component } from 'react'
import { omit } from 'lodash'
import { createPortal } from 'react-dom'
import { defaultStyle } from 'substyle'

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

const Portal = ({ container, containerRef, children, ...rest }) =>
  createPortal(
    <div ref={containerRef} {...rest}>
      {children}
    </div>,
    container
  )

class StickPortal extends Component<FinalPropsT, StateT> {
  element: HTMLElement
  container: HTMLElement
  animationId: number
  lastCallbackAsAnimationFrame: boolean

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
    this.container = document.createElement('div')
  }

  componentDidMount() {
    if (this.props.node) {
      this.mountContainer()
      this.startTracking()
    }
  }

  componentDidUpdate(prevProps: FinalPropsT) {
    if (this.props.node && !prevProps.node) {
      this.mountContainer()
      this.startTracking()
    }

    if (this.props.transportTo !== prevProps.transportTo && this.props.node) {
      // re-call mountContainer, which will also move the node to the new container
      this.mountContainer()
    }

    if (!this.props.node && prevProps.node) {
      this.stopTracking()
      this.unmountContainer()
    }
  }

  componentWillUnmount() {
    if (this.container) {
      this.stopTracking()
      this.unmountContainer()
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
    const { node, style, nestingKey, containerRef, nodeWidth } = this.props
    const { style: inlineStyles, ...stylingAttrs } = style('node')
    const nodeStyle = {
      ...inlineStyles,
      position: 'absolute',
      zIndex: 99,
      ...this.state,
      ...(nodeWidth != null ? { width: nodeWidth } : {}),
    }

    return (
      <Portal
        {...stylingAttrs}
        style={nodeStyle}
        container={this.container}
        containerRef={containerRef}
        data-sticknestingkey={nestingKey}
      >
        {node}
      </Portal>
    )
  }

  unmountContainer() {
    if (this.container.parentNode) {
      this.container.parentNode.removeChild(this.container)
    }
  }

  mountContainer() {
    const parent = this.props.transportTo || document.body
    parent.appendChild(this.container)
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
      zIndex: 99,
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

function topLeft(element: HTMLElement) {
  const { width, left, top } = element.getBoundingClientRect()
  return { width, left: left + scrollX(), top: top + scrollY() }
}

function topRight(element: HTMLElement) {
  const { width, right, top } = element.getBoundingClientRect()
  return { width, left: right + scrollX(), top: top + scrollY() }
}

function topCenter(element: HTMLElement) {
  const { width, left, top } = element.getBoundingClientRect()
  return { width, left: left + scrollX() + width / 2, top: top + scrollY() }
}

function bottomLeft(element: HTMLElement) {
  const { width, left, bottom } = element.getBoundingClientRect()
  return { width, left: left + scrollX(), top: bottom + scrollY() }
}

function bottomRight(element: HTMLElement) {
  const { width, right, bottom } = element.getBoundingClientRect()
  return { width, left: right + scrollX(), top: bottom + scrollY() }
}

function bottomCenter(element: HTMLElement) {
  const { width, left, bottom } = element.getBoundingClientRect()
  return { width, left: left + scrollX() + width / 2, top: bottom + scrollY() }
}

function middleRight(element: HTMLElement) {
  const { width, height, right, top } = element.getBoundingClientRect()
  return { width, left: right + scrollX(), top: top + scrollY() + height / 2 }
}

function middleCenter(element: HTMLElement) {
  const { width, height, left, top } = element.getBoundingClientRect()
  return {
    width,
    left: left + scrollX() + width / 2,
    top: top + scrollY() + height / 2,
  }
}

function middleLeft(element: HTMLElement) {
  const { width, height, left, top } = element.getBoundingClientRect()
  return { width, left: left + scrollX(), top: top + scrollY() + height / 2 }
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
