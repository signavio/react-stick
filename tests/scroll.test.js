import expect from 'expect'
import React, { cloneElement } from 'react'
import { render as renderBase, unmountComponentAtNode } from 'react-dom'
import { times } from 'lodash'

import Stick from 'src/'

describe('positioning in scrolling window', () => {
  let host, scrollHeight, fixedElement

  const longText = times(50, () => 'Lorem ipsum dolor sit amet.').join(' ')
  const anchor = <div id="anchor" />
  const node = <div id="node">{longText}</div>

  // wrap render to invoke callback only after the node has actually been mounted
  const render = (stick, host, callback) => {
    let called = false
    renderBase(
      // sets documentElement's scroll width to 1008
      <div style={{ width: 1000, height: 10000 }}>
        <div style={{ position: 'absolute', height: 0, top: 5000 }}>
          {cloneElement(stick, {
            node: cloneElement(stick.props.node, {
              ref: el => !!el && !called && window.setTimeout(callback, 1),
            }),
          })}
        </div>
      </div>,
      host
    )
    scrollHeight = document.documentElement.scrollHeight
  }

  beforeEach(() => {
    host = document.createElement('div')
    fixedElement = document.createElement('div')
    fixedElement.style.position = 'fixed'
    fixedElement.style.top = '0'
    document.body.appendChild(host)
    document.body.appendChild(fixedElement)
    window.scrollTo(0, 0)
  })

  afterEach(() => {
    unmountComponentAtNode(host)
    document.body.removeChild(host)
    document.body.removeChild(fixedElement)
  })

  it('should keep the correct the node position when scrolling', done => {
    render(
      <Stick position="bottom left" align="top left" node={node}>
        {anchor}
      </Stick>,
      host,
      () => {
        const nodeElement = document.getElementById('node')
        const { top } = nodeElement.getBoundingClientRect()
        expect(top).toEqual(5000)

        window.scrollTo(0, 3000)

        // getBoundingClientRect takes the scrolling amount into account
        const { top: topAfterScroll } = nodeElement.getBoundingClientRect()
        expect(topAfterScroll).toEqual(2000) // 5000 absolute position - 3000 scroll top
        done()
      }
    )
  })

  it('should keep the correct the node position when transported to a fixed container', done => {
    render(
      <Stick
        position="bottom left"
        align="top left"
        node={node}
        transportTo={fixedElement}
      >
        {anchor}
      </Stick>,
      host,
      () => {
        console.log(scrollHeight)
        const nodeElement = document.getElementById('node')
        const { top } = nodeElement.getBoundingClientRect()
        expect(top).toEqual(5000)

        window.scrollTo(0, 3000)

        // in the fixed transport target, the scrolling of the viewport should have no effect
        const { top: topAfterScroll } = nodeElement.getBoundingClientRect()
        expect(topAfterScroll).toEqual(5000)
        done()
      }
    )
  })
})
