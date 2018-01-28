import expect from 'expect'
import React, { cloneElement } from 'react'
import { render as renderBase, unmountComponentAtNode } from 'react-dom'

import Stick from 'src/'

describe('nesting', () => {
  let host

  beforeEach(() => {
    host = document.createElement('div')
    document.body.appendChild(host)
  })

  afterEach(() => {
    unmountComponentAtNode(host)
    document.body.removeChild(host)
  })

  // wrap render to invoke callback only after the node has actually been mounted
  const render = (stick, host, callback) => {
    let called = false
    renderBase(
      // wrap in inline-block container so that the stick container adjusts to anchor size
      <div style={{ display: 'inline-block ' }}>
        {cloneElement(stick, {
          node: cloneElement(stick.props.node, {
            ref: el => !!el && !called && window.setTimeout(callback, 1),
          }),
        })}
      </div>,
      host
    )
  }
})
