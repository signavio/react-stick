// @flow
import { Component } from 'react'
import { findDOMNode } from 'react-dom'

const getBoundingClientRect = (instance: Component<any, any>): ClientRect => {
  // $FlowIgnore: we only allow string type components, so we will always find an Element
  const element: Element = findDOMNode(instance)
  return element.getBoundingClientRect()
}

export default getBoundingClientRect
