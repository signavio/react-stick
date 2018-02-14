import expect from 'expect'
import React, { cloneElement } from 'react'
import { render as renderBase, unmountComponentAtNode } from 'react-dom'
import { times } from 'lodash'

import Stick from 'src/'

describe('stick node width', () => {
  let host, scrollWidth

  const longText = times(50, () => 'Lorem ipsum dolor sit amet.').join(' ')
  const anchor = <div id="anchor" />
  const node = <div id="node">{longText}</div>

  // wrap render to invoke callback only after the node has actually been mounted
  const render = (stick, host, callback) => {
    let called = false
    renderBase(
      // set documentElement's the scroll width to 1008
      <div style={{ width: 1000, height: 9999 }}>
        <span>asd</span>
        <div style={{ position: 'absolute', width: 100, left: 100 }}>
          {cloneElement(stick, {
            node: cloneElement(stick.props.node, {
              ref: el => !!el && !called && window.setTimeout(callback, 1),
            }),
          })}
        </div>
      </div>,
      host
    )
    scrollWidth = document.documentElement.scrollWidth
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
            const { right } = nodeElement.getBoundingClientRect()
            expect(right).toEqual(scrollWidth)
            done()
          }
        )
      })

      it('should make sure that a right aligned node stretches to the left screen border', done => {
        render(
          <Stick
            inline={inline}
            position="middle left"
            align="middle right"
            node={node}
          >
            {anchor}
          </Stick>,
          host,
          () => {
            const nodeElement = document.getElementById('node')
            const { left } = nodeElement.getBoundingClientRect()
            expect(left).toEqual(0)
            done()
          }
        )
      })

      describe('sameWidth={true}', () => {
        it('should make sure that the stick node has the same width as the anchor', done => {
          render(
            <Stick inline={inline} sameWidth node={node}>
              {anchor}
            </Stick>,
            host,
            () => {
              const nodeElement = document.getElementById('node')
              const { width } = nodeElement.getBoundingClientRect()
              expect(width).toEqual(100)
              done()
            }
          )
        })
      })
    })
  })
})
