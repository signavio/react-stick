import expect from 'expect'
import React, { cloneElement } from 'react'
import { render as renderBase, unmountComponentAtNode } from 'react-dom'

import Stick from 'src/'

describe('updates', () => {
  let host

  const anchor = <div id="anchor" />
  const node = <div id="node" />

  // wrap render to invoke callback only after the node has actually been mounted
  const render = (stick, host, callback) => {
    let called = false
    renderBase(
      <div style={{ width: 10, height: 10 }}>
        {cloneElement(stick, {
          node:
            stick.props.node &&
            cloneElement(stick.props.node, {
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

  it('should work if the node is only provided after the initial mount', done => {
    render(<Stick>{anchor}</Stick>, host)
    render(
      <Stick position="middle right" node={node}>
        {anchor}
      </Stick>,
      host,
      () => {
        const nodeElement = document.getElementById('node')
        const { left, top } = nodeElement.getBoundingClientRect()
        expect(left).toEqual(18)
        expect(top).toEqual(8)
        done()
      }
    )
  })

  it('should unmount node container if no node is passed anymore', done => {
    render(<Stick node={node}>{anchor}</Stick>, host, () => {
      const bodyChildrenCountWithStick = document.body.childElementCount
      render(<Stick>{anchor}</Stick>, host)
      expect(document.getElementById('node')).toBe(null)
      expect(document.body.childElementCount).toBe(
        bodyChildrenCountWithStick - 1
      )
      done()
    })
  })

  it('should correctly apply `sameWidth` if set after initial mount', done => {
    render(<Stick node={node}>{anchor}</Stick>, host, () => {
      render(
        <Stick node={node} sameWidth>
          {anchor}
        </Stick>,
        host,
        () =>
          window.setTimeout(() => {
            // we have to wait for first measure to be applied
            const nodeElement = document.getElementById('node')
            const { width } = nodeElement.getBoundingClientRect()
            expect(width).toEqual(10)
            done()
          }, 100)
      )
    })
  })

  it('should correctly handle clearing of `sameWidth` after initial mount', done => {
    render(
      <Stick sameWidth node={node}>
        {anchor}
      </Stick>,
      host,
      () => {
        render(<Stick node={node}>{anchor}</Stick>, host, () => {
          const nodeElement = document.getElementById('node')
          const { width } = nodeElement.getBoundingClientRect()
          expect(width).toEqual(0) // empty content means zero width
          done()
        })
      }
    )
  })

  it('should handle switching to `updateOnAnimationFrame` correctly', done => {
    render(
      <Stick node={node} position="middle right">
        {anchor}
      </Stick>,
      host,
      () => {
        render(
          <Stick node={node} position="middle right" updateOnAnimationFrame>
            {anchor}
          </Stick>,
          host,
          () => {
            const nodeElement = document.getElementById('node')
            const { left, top } = nodeElement.getBoundingClientRect()
            expect(left).toEqual(18)
            expect(top).toEqual(8)
            done()
          }
        )
      }
    )
  })

  it('should handle switching back from `updateOnAnimationFrame` correctly', done => {
    render(
      <Stick node={node} position="middle right" updateOnAnimationFrame>
        {anchor}
      </Stick>,
      host,
      () => {
        render(
          <Stick node={node} position="middle right">
            {anchor}
          </Stick>,
          host,
          () => {
            const nodeElement = document.getElementById('node')
            const { left, top } = nodeElement.getBoundingClientRect()
            expect(left).toEqual(18)
            expect(top).toEqual(8)
            done()
          }
        )
      }
    )
  })
})
