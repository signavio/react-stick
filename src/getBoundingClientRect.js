// @flow
import { Component } from 'react'
import { findDOMNode } from 'react-dom'

const getBoundingClientRect = (instance: Component<any, any>): ClientRect => {
  let element = findDOMNode(instance)
  if (element instanceof Text) {
    element = element.parentElement
  }
  if (!element) {
    throw new Error(
      'The `component` passed to <Stick /> must render a DOM node!'
    )
  }
  return element.getBoundingClientRect()
}

export default getBoundingClientRect
