// @flow
import { Component } from 'react'
import { findDOMNode } from 'react-dom'

const getBoundingClientRect = (instance: Component<any, any>): ClientRect => {
  let element = findDOMNode(instance)
  if (element instanceof Text) {
    element = element.parentElement
  }
  if (!element) {
    throw new Error('Children of <Stick /> must render something!')
  }
  return element.getBoundingClientRect()
}

export default getBoundingClientRect
