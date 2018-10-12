import expect from 'expect'
import React from 'react'
import { unmountComponentAtNode } from 'react-dom'

import Stick from '../src'

import { render } from './utils'

const windowHeight = window.innerHeight

const halfWindowSize = windowHeight / 2
const quarterWindowSize = windowHeight / 4

describe('autoPositioning', () => {
  let host

  beforeEach(() => {
    host = document.createElement('div')

    document.body.appendChild(host)
  })

  afterEach(() => {
    unmountComponentAtNode(host)
    document.body.removeChild(host)
  })

  describe('vertical', () => {
    const node = (
      <div id="node" style={{ height: quarterWindowSize, width: 100 }} />
    )

    it('should move the node form bottom to top if there is not enough space at the bottom.', done => {
      const stick = (
        <Stick autoFlipVertically position="bottom center" node={node}>
          <div
            id="anchor"
            style={{
              position: 'relative',
              height: 100,
              top: halfWindowSize + quarterWindowSize + 100,
            }}
          />
        </Stick>
      )

      render(stick, host, () => {
        setTimeout(() => {
          const nodeElement = document.getElementById('node')
          const anchorElement = document.getElementById('anchor')

          const { top: nodeTop } = nodeElement.getBoundingClientRect()
          const { top: anchorTop } = anchorElement.getBoundingClientRect()

          expect(anchorTop).toBeGreaterThan(nodeTop)

          done()
        }, 100)
      })
    })

    it('should move the node from top to bottom if there is not enough space a the top.', done => {
      const stick = (
        <Stick autoFlipVertically position="top center" node={node}>
          <div
            id="anchor"
            style={{
              position: 'relative',
              height: 100,
            }}
          />
        </Stick>
      )

      render(stick, host, () => {
        setTimeout(() => {
          const nodeElement = document.getElementById('node')
          const anchorElement = document.getElementById('anchor')

          const { top: nodeTop } = nodeElement.getBoundingClientRect()
          const { top: anchorTop } = anchorElement.getBoundingClientRect()

          expect(anchorTop).toBeLessThan(nodeTop)

          done()
        }, 100)
      })
    })

    it('should not move the node from top to bottom if there is neither enough space at the top nor the botom.', done => {
      const stick = (
        <Stick autoFlipVertically position="top center" node={node}>
          <div
            id="anchor"
            style={{
              position: 'relative',
              height: windowHeight,
            }}
          />
        </Stick>
      )

      render(stick, host, () => {
        setTimeout(() => {
          const nodeElement = document.getElementById('node')
          const anchorElement = document.getElementById('anchor')

          const { top: nodeTop } = nodeElement.getBoundingClientRect()
          const { top: anchorTop } = anchorElement.getBoundingClientRect()

          expect(anchorTop).toBeGreaterThan(nodeTop)

          done()
        }, 100)
      })
    })

    it('should not move the node from bottom to top if there is neither enough space at the bottom nor the top.', done => {
      const stick = (
        <Stick autoFlipVertically position="bottom center" node={node}>
          <div
            id="anchor"
            style={{
              position: 'relative',
              height: windowHeight,
            }}
          />
        </Stick>
      )

      render(stick, host, () => {
        setTimeout(() => {
          const nodeElement = document.getElementById('node')
          const anchorElement = document.getElementById('anchor')

          const { top: nodeTop } = nodeElement.getBoundingClientRect()
          const { top: anchorTop } = anchorElement.getBoundingClientRect()

          expect(anchorTop).toBeLessThan(nodeTop)

          done()
        }, 100)
      })
    })
  })
})
