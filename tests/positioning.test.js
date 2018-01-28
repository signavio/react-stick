import expect from 'expect'
import React, { cloneElement } from 'react'
import { render as renderBase, unmountComponentAtNode } from 'react-dom'

import Stick from 'src/'

describe('positioning', () => {
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
    unmountComponentAtNode(host)
    document.body.removeChild(host)
  })

  const widthFactor = position => {
    switch (position) {
      case 'left':
        return 0
      case 'center':
        return 0.5
      case 'right':
        return 1
      default:
        return
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
      default:
        return
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

  verticals.forEach(verticalPosition => {
    horizontals.forEach(horizontalPosition => {
      const position = `${verticalPosition} ${horizontalPosition}`

      describe(`position="${position}"`, () => {
        verticals.forEach(verticalAlign => {
          horizontals.forEach(horizontalAlign => {
            const align = `${verticalAlign} ${horizontalAlign}`

            const expectedLeft = calcLeft(horizontalPosition, horizontalAlign)
            const expectedTop = calcTop(verticalPosition, verticalAlign)

            describe(`align="${align}"`, () => {
              it(`should place at left: ${expectedLeft} top: ${expectedTop}`, done => {
                render(
                  <Stick node={node} position={position} align={align}>
                    {anchor}
                  </Stick>,
                  host,
                  () => {
                    const nodeElement = document.getElementById('node')
                    const { left, top } = nodeElement.getBoundingClientRect()
                    expect(left).toEqual(expectedLeft)
                    expect(top).toEqual(expectedTop)
                    done()
                  }
                )
              })

              it(`should place at left: ${expectedLeft} top: ${expectedTop} with \`inline\` prop`, done => {
                render(
                  <Stick inline node={node} position={position} align={align}>
                    {anchor}
                  </Stick>,
                  host,
                  () => {
                    const nodeElement = document.getElementById('node')
                    const { left, top } = nodeElement.getBoundingClientRect()
                    expect(left).toEqual(expectedLeft)
                    expect(top).toEqual(expectedTop)
                    done()
                  }
                )
              })
            })
          })
        })

        it('should use the correct default `align`', done => {
          const defaultAligns = {
            'top left': 'bottom left',
            'top center': 'bottom center',
            'top right': 'bottom right',
            'middle left': 'middle right',
            'middle center': 'middle center',
            'middle right': 'middle left',
            'bottom left': 'top left',
            'bottom center': 'top center',
            'bottom right': 'top right',
          }

          const stick = (
            <Stick node={node} position={position}>
              {anchor}
            </Stick>
          )
          const otherStick = (
            <Stick
              node={node}
              position={position}
              align={defaultAligns[position]}
            >
              {anchor}
            </Stick>
          )
          render(stick, host, () => {
            const nodeElement = document.getElementById('node')
            const { left, top } = nodeElement.getBoundingClientRect()

            render(otherStick, host, () => {
              const nodeElement = document.getElementById('node')
              const {
                left: otherLeft,
                top: otherTop,
              } = nodeElement.getBoundingClientRect()

              expect(left).toBe(otherLeft)
              expect(top).toBe(otherTop)
              done()
            })
          })
        })
      })
    })
  })
})
