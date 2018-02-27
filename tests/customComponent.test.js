import expect from 'expect'
import React, { cloneElement } from 'react'
import { render as renderBase, unmountComponentAtNode } from 'react-dom'

import Stick from 'src/'

describe('customize wrapper component', () => {
  let host

  const node = <div id="node" />

  // wrap render in an svg element
  const renderSvg = (stick, host, callback) => {
    let called = false
    renderBase(
      <svg width="400" height="200">
        {cloneElement(stick, {
          node: cloneElement(stick.props.node, {
            ref: el => !!el && !called && window.setTimeout(callback, 1),
          }),
        })}
      </svg>,
      host
    )
  }

  beforeEach(() => {
    host = document.createElement('div')
    document.body.appendChild(host)
  })

  afterEach(() => {
    unmountComponentAtNode(host)
    document.body.removeChild(host)
  })

  it('should be possible to render in SVG by passing `"g"` as `component`', done => {
    renderSvg(
      <Stick component="g" position="top center" node={node}>
        <ellipse
          cx="200"
          cy="100"
          rx="100"
          ry="50"
          style={{ fill: 'rgb(24, 170, 177)' }}
        />
      </Stick>,
      host,
      () => {
        const nodeElement = document.getElementById('node')
        const { left, top } = nodeElement.getBoundingClientRect()
        expect(left).toEqual(208)
        expect(top).toEqual(58)
        done()
      }
    )
  })
})
