import expect from 'expect'
import React, { cloneElement } from 'react'
import { render as renderBase, unmountComponentAtNode } from 'react-dom'

import Stick from 'src/'

describe('Stick', () => {
  let host

  const verticals = ['top', 'middle', 'bottom']
  const horizontals = ['left', 'center', 'right']

  const BODY_PADDING = 8

  const NODE_WIDTH = 10
  const NODE_HEIGHT = 20
  const node = (
    <div id="node" style={{ width: NODE_WIDTH, height: NODE_HEIGHT }} />
  )

  const ANCHOR_WIDTH = 30
  const ANCHOR_HEIGHT = 40
  const anchor = (
    <div id="anchor" style={{ width: ANCHOR_WIDTH, height: ANCHOR_HEIGHT }} />
  )

  beforeEach(() => {
    host = document.createElement('div')
    document.body.appendChild(host)
  })

  afterEach(() => {
    document.body.removeChild(host)
  })

  afterEach(() => {
    unmountComponentAtNode(host)
  })

  // wrap render to invoke callback only after the node has actually been mounted
  const render = (stick, host, callback) => {
    let called = false
    renderBase(
      cloneElement(stick, {
        node: cloneElement(stick.props.node, {
          ref: el => !!el && !called && callback(el),
        }),
      }),
      host
    )
  }

  const widthFactor = position => {
    switch (position) {
      case 'left':
        return 0
      case 'center':
        return 0.5
      case 'right':
        return 1
    }
  }

  const heightFactor = position => {
    switch (position) {
      case 'top':
        return 0
      case 'middle':
        return 0.5
      case 'bottom':
        return 1
    }
  }

  const calcLeft = (position, align) =>
    BODY_PADDING +
    widthFactor(position) * ANCHOR_WIDTH -
    widthFactor(align) * NODE_WIDTH

  const calcTop = (position, align) =>
    BODY_PADDING +
    heightFactor(position) * ANCHOR_HEIGHT -
    heightFactor(align) * NODE_HEIGHT

  verticals.forEach(verticalPosition => {
    horizontals.forEach(horizontalPosition => {
      verticals.forEach(verticalAlign => {
        horizontals.forEach(horizontalAlign => {
          const position = `${verticalPosition} ${horizontalPosition}`
          const align = `${verticalAlign} ${horizontalAlign}`

          it(`should correctly render for \`position="${position}"\` and \`align="${align}"\``, () => {
            render(
              <Stick node={node} position={position} align={align}>
                {anchor}
              </Stick>,
              host,
              el => {
                const nodeElement = document.getElementById('node')
                const { left, top } = nodeElement.getBoundingClientRect()
                expect(left).toEqual(
                  calcLeft(horizontalPosition, horizontalAlign)
                )
                expect(top).toEqual(calcTop(verticalPosition, verticalAlign))
              }
            )
          })
        })
      })
    })
  })
})
