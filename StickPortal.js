// @flow

import React, { Component, createElement } from 'react'
import { omit } from 'lodash'
import {
  unmountComponentAtNode,
  unstable_renderSubtreeIntoContainer, // eslint-disable-line camelcase
} from 'react-dom'
import shallowCompare from 'react-addons-shallow-compare'
import defaultStyle from 'substyle'

import type { PositionT, PropsT } from './flowTypes'

type StateT = {
  top: number,
  left: number,
  width: number,
};

declare function requestAnimationFrame(func: Function): number;
declare function cancelAnimationFrame(id: number): void;

export default class StickPortal extends Component {

  props: PropsT;
  state: StateT;

  element: HTMLElement;
  container: HTMLElement;
  animationId: number;

  static defaultProps = {
    position: 'bottom left',
  };

  constructor(props: PropsT) {
    super(props)
    this.state = {
      top: 0,
      left: 0,
      width: 0,
    }
  }

  componentDidMount() {
    this.measure()
  }

  shouldComponentUpdate(nextProps: PropsT, nextState: StateT) {
    return shallowCompare(this, nextProps, nextState)
  }

  componentDidUpdate() {
    this.measure()
    if (this.props.node) {
      this.renderNode()
    }

    if (!this.props.node && this.container) {
      this.unmountNode()
    }
  }

  componentWillUnmount() {
    if (this.container) {
      this.unmountNode()
    }
  }

  render() {
    const { children, ...rest } = this.props
    return (
      <div
        {...omit(rest, 'node', 'position')}
        ref={(ref: HTMLElement) => { this.element = ref }}
      >
        { children }
      </div>
    )
  }

  renderNode() {
    if (!this.container) {
      this.container = createContainer()
      this.track()
    }

    const { className, style } = substyle(this.props, 'node')

    const finalStyle = {
      ...(style || {}),
      ...this.state,
    }

    unstable_renderSubtreeIntoContainer(
      this,
      createElement('div', { style: finalStyle, className }, this.props.node),
      this.container
    )
  }

  unmountNode() {
    cancelAnimationFrame(this.animationId)
    unmountComponentAtNode(this.container)
    document.body.removeChild(this.container)
    delete this.container
  }

  track() {
    this.animationId = requestAnimationFrame(() => this.track())
    this.measure()
  }

  measure() {
    const newStyle = calculateStyle(this.props.position, this.element)
    this.setState(newStyle)
  }

}

const realSubstyle = defaultStyle({
  style: {
    node: {
      position: 'absolute',
      zIndex: 99,
    },
  },
}, ({ position = 'bottom left' }: PropsT) => {
  const [verticalPos, horizontalPos] = position.split(' ')
  return {
    [`&${verticalPos}`]: true,
    [`&${horizontalPos}`]: true,
  }
})

// workaround for babel bug: break up substyle chaining and return a plain object
const substyle = (...args) => ({
  ...realSubstyle(...args),
})


function createContainer() {
  const container = document.createElement('div')
  document.body.appendChild(container)
  return container
}

function calculateStyle(position: PositionT, element: HTMLElement) {
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
  return { width, left: left + scrollX() + (width / 2), top: top + scrollY() }
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
  return { width, left: left + scrollX() + (width / 2), top: bottom + scrollY() }
}

function middleRight(element: HTMLElement) {
  const { width, height, right, top } = element.getBoundingClientRect()
  return { width, left: right + scrollX(), top: top + scrollY() + (height / 2) }
}

function middleCenter(element: HTMLElement) {
  const { width, height, left, top } = element.getBoundingClientRect()
  return { width, left: left + scrollX() + (width / 2), top: top + scrollY() + (height / 2) }
}

function middleLeft(element: HTMLElement) {
  const { width, height, left, top } = element.getBoundingClientRect()
  return { width, left: left + scrollX(), top: top + scrollY() + (height / 2) }
}

/*
 * Don't believe me dog?
 * ok.
 * https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollY#Notes
 */
function hasPageOffset() {
  return (
    typeof window !== 'undefined' &&
    typeof window.pageXOffset !== undefined
  )
}

function isCSS1Compat() {
  const compatMode = (
    typeof document !== 'undefined' &&
    typeof document.compatMode === 'string'
  ) ? document.compatMode : ''

  return compatMode === 'CSS1Compat'
}

function scrollY() {
  if (typeof window !== 'undefined' && typeof window.scrollY === 'number') {
    return window.scrollY
  }

  if (hasPageOffset() === true) {
    return window.pageYOffset
  }

  if (isCSS1Compat() === true) {
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

  if (isCSS1Compat === true) {
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
