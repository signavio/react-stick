import expect, { createSpy } from 'expect'
import React, { cloneElement } from 'react'
import { render as renderBase, unmountComponentAtNode } from 'react-dom'
import { times } from 'lodash'

import Stick from 'src/'

describe('stick node width', () => {
  let host

  const longText = times(25, () => 'Lorem ipsum dolor sit amet.').join(' ')
  const anchor = <div id="anchor" />
  const node = <div id="node">{longText}</div>

  // wrap render to invoke callback only after the node has actually been mounted
  const render = (stick, host, callback) => {
    let called = false
    renderBase(
      <div style={{ position: 'absolute', width: 100, left: 100 }}>
        {cloneElement(stick, {
          node: cloneElement(stick.props.node, {
            ref: el => !!el && !called && window.setTimeout(callback, 1),
          }),
        })}
      </div>,
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

  const inlineOptions = [false, true]
  inlineOptions.forEach(inline => {
    describe(`inline={${inline}}`, () => {
      it('should make sure that a left aligned node stretches to the right screen border', done => {
        render(
          <Stick
            inline={inline}
            position="middle right"
            align="middle left"
            node={node}
          >
            {anchor}
          </Stick>,
          host,
          () => {
            const nodeElement = document.getElementById('node')
            const {
              width,
              left,
              top,
              right,
            } = nodeElement.getBoundingClientRect()
            console.log('width', width)
            console.log('left', left)
            console.log('top', top)
            console.log('right', right)
            expect(right).toEqual(document.documentElement.clientWidth)
            done()
          }
        )
      })
    })
  })
})
