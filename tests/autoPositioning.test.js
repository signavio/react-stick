import expect from 'expect'
import React from 'react'
import { unmountComponentAtNode } from 'react-dom'

import Stick from '../src'
import { render } from './utils'

const windowHeight = window.innerHeight
const windowWidth = window.innerWidth

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

  const node = <div id="node" style={{ height: 100, width: 100 }} />
  const anchor = <div id="anchor" style={{ height: 100, width: 100 }} />

  describe('vertical', () => {
    it('should move the node from bottom to top if there is not enough space at the bottom.', done => {
      render(
        <Stick
          autoFlipVertically
          position="bottom center"
          node={node}
          style={{ marginTop: windowHeight }}
        >
          {anchor}
        </Stick>,
        host,
        () => {
          setTimeout(() => {
            const nodeElement = document.getElementById('node')
            const anchorElement = document.getElementById('anchor')

            const {
              top: nodeTop,
              height: nodeHeight,
            } = nodeElement.getBoundingClientRect()
            const { top: anchorTop } = anchorElement.getBoundingClientRect()

            expect(anchorTop).toEqual(nodeTop + nodeHeight)

            done()
          }, 100)
        }
      )
    })

    it('should move the node back to its original intended position if space clears up (initial position: "bottom center").', done => {
      render(
        <Stick
          autoFlipVertically
          position="bottom center"
          node={node}
          style={{ marginTop: windowHeight }}
        >
          {anchor}
        </Stick>,
        host,
        () => {
          setTimeout(() => {
            render(
              <Stick
                autoFlipVertically
                position="bottom center"
                node={node}
                style={{ marginTop: 0 }}
              >
                {anchor}
              </Stick>,
              host,
              () => {
                setTimeout(() => {
                  const nodeElement = document.getElementById('node')
                  const anchorElement = document.getElementById('anchor')

                  const { top: nodeTop } = nodeElement.getBoundingClientRect()
                  const {
                    top: anchorTop,
                    height: anchorHeight,
                  } = anchorElement.getBoundingClientRect()

                  expect(nodeTop).toEqual(anchorTop + anchorHeight)

                  done()
                }, 100)
              }
            )
          }, 100)
        }
      )
    })

    it('should move the node back to its original intended position if space clears up (initial position: "top center").', done => {
      render(
        <Stick autoFlipVertically position="top center" node={node}>
          {anchor}
        </Stick>,
        host,
        () => {
          setTimeout(() => {
            render(
              <Stick
                autoFlipVertically
                position="top center"
                node={node}
                style={{ marginTop: windowHeight }}
              >
                {anchor}
              </Stick>,
              host,
              () => {
                setTimeout(() => {
                  const nodeElement = document.getElementById('node')
                  const anchorElement = document.getElementById('anchor')

                  const {
                    top: nodeTop,
                    height: nodeHeight,
                  } = nodeElement.getBoundingClientRect()
                  const {
                    top: anchorTop,
                  } = anchorElement.getBoundingClientRect()

                  expect(anchorTop).toEqual(nodeTop + nodeHeight)

                  done()
                }, 100)
              }
            )
          }, 100)
        }
      )
    })

    it('should not move the node from top to bottom if there is not enough space a the top.', done => {
      render(
        <Stick
          autoFlipVertically
          position="top center"
          node={node}
          style={{ marginTop: windowHeight }}
        >
          {anchor}
        </Stick>,
        host,
        () => {
          setTimeout(() => {
            const nodeElement = document.getElementById('node')
            const anchorElement = document.getElementById('anchor')

            const {
              top: nodeTop,
              height: nodeHeight,
            } = nodeElement.getBoundingClientRect()
            const { top: anchorTop } = anchorElement.getBoundingClientRect()

            expect(anchorTop).toEqual(nodeTop + nodeHeight)

            done()
          }, 100)
        }
      )
    })

    it('should not move the node from top to bottom if there is neither enough space at the top nor the botom.', done => {
      render(
        <Stick
          autoFlipVertically
          position="top center"
          node={node}
          style={{ height: windowHeight }}
        >
          {anchor}
        </Stick>,
        host,
        () => {
          setTimeout(() => {
            const nodeElement = document.getElementById('node')
            const anchorElement = document.getElementById('anchor')

            const {
              top: nodeTop,
              height: nodeHeight,
            } = nodeElement.getBoundingClientRect()
            const { top: anchorTop } = anchorElement.getBoundingClientRect()

            expect(anchorTop).toEqual(nodeTop + nodeHeight)

            done()
          }, 100)
        }
      )
    })

    it('should not move the node from bottom to top if there is neither enough space at the bottom nor the top.', done => {
      render(
        <Stick autoFlipVertically position="bottom center" node={node}>
          <div id="anchor" style={{ width: 100, height: windowHeight }} />
        </Stick>,
        host,
        () => {
          setTimeout(() => {
            const nodeElement = document.getElementById('node')
            const anchorElement = document.getElementById('anchor')

            const { top: nodeTop } = nodeElement.getBoundingClientRect()
            const {
              top: anchorTop,
              height: anchorHeight,
            } = anchorElement.getBoundingClientRect()

            expect(nodeTop).toEqual(anchorTop + anchorHeight)

            done()
          }, 100)
        }
      )
    })
  })

  describe('horizontal', () => {
    it('should move the node from left to right if there is not enough space at the left.', done => {
      render(
        <Stick autoFlipHorizontally position="middle left" node={node}>
          {anchor}
        </Stick>,
        host,
        () => {
          setTimeout(() => {
            const nodeElement = document.getElementById('node')
            const anchorElement = document.getElementById('anchor')

            const { left: nodeLeft } = nodeElement.getBoundingClientRect()
            const {
              left: anchorLeft,
              width: anchorWidth,
            } = anchorElement.getBoundingClientRect()

            expect(nodeLeft).toEqual(anchorLeft + anchorWidth)

            done()
          }, 100)
        }
      )
    })

    it('should move the node back to its original intended position if space clears up (initial position: "middle right").', done => {
      render(
        <Stick
          autoFlipHorizontally
          position="middle right"
          node={node}
          style={{ marginLeft: windowWidth }}
        >
          {anchor}
        </Stick>,
        host,
        () => {
          setTimeout(() => {
            render(
              <Stick
                autoFlipHorizontally
                position="middle right"
                node={node}
                style={{ marginLeft: 0 }}
              >
                {anchor}
              </Stick>,
              host,
              () => {
                setTimeout(() => {
                  const nodeElement = document.getElementById('node')
                  const anchorElement = document.getElementById('anchor')

                  const { left: nodeLeft } = nodeElement.getBoundingClientRect()
                  const {
                    left: anchorLeft,
                    width: anchorWidth,
                  } = anchorElement.getBoundingClientRect()

                  expect(nodeLeft).toEqual(anchorLeft + anchorWidth)

                  done()
                }, 100)
              }
            )
          }, 100)
        }
      )
    })

    it('should move the node back to its original intended position if space clears up (initial position: "middle left").', done => {
      render(
        <Stick autoFlipHorizontally position="middle left" node={node}>
          {anchor}
        </Stick>,
        host,
        () => {
          setTimeout(() => {
            render(
              <Stick
                autoFlipHorizontally
                position="middle left"
                style={{
                  marginLeft: windowWidth,
                }}
                node={node}
              >
                {anchor}
              </Stick>,

              host,
              () => {
                setTimeout(() => {
                  const nodeElement = document.getElementById('node')
                  const anchorElement = document.getElementById('anchor')

                  const {
                    left: nodeLeft,
                    width: nodeWidth,
                  } = nodeElement.getBoundingClientRect()
                  const {
                    left: anchorLeft,
                    width: anchorWidth,
                  } = anchorElement.getBoundingClientRect()

                  console.log(nodeWidth, nodeLeft, anchorWidth, anchorLeft)

                  expect(anchorLeft).toEqual(nodeLeft + nodeWidth)

                  done()
                }, 100)
              }
            )
          }, 100)
        }
      )
    })

    it('should move the node from right to left if there is not enough space a the right.', done => {
      render(
        <Stick
          autoFlipHorizontally
          position="middle right"
          node={node}
          style={{ marginLeft: windowWidth }}
        >
          {anchor}
        </Stick>,
        host,
        () => {
          setTimeout(() => {
            const nodeElement = document.getElementById('node')
            const anchorElement = document.getElementById('anchor')

            const {
              left: nodeLeft,
              width: nodeWidth,
            } = nodeElement.getBoundingClientRect()
            const { left: anchorLeft } = anchorElement.getBoundingClientRect()

            expect(anchorLeft).toEqual(nodeLeft + nodeWidth)

            done()
          }, 100)
        }
      )
    })

    it('should not move the node from left to right if there is neither enough space at the left nor the right.', done => {
      render(
        <Stick
          autoFlipHorizontally
          position="middle left"
          node={node}
          style={{ width: windowWidth }}
        >
          {anchor}
        </Stick>,
        host,
        () => {
          setTimeout(() => {
            const nodeElement = document.getElementById('node')
            const anchorElement = document.getElementById('anchor')

            const {
              left: nodeLeft,
              width: nodeWidth,
            } = nodeElement.getBoundingClientRect()
            const { left: anchorLeft } = anchorElement.getBoundingClientRect()

            expect(anchorLeft).toEqual(nodeLeft + nodeWidth)

            done()
          }, 100)
        }
      )
    })

    it('should not move the node from right to left if there is neither enough space at the right nor the left.', done => {
      render(
        <Stick autoFlipHorizontally position="middle right" node={node}>
          <div id="anchor" style={{ height: 100, width: windowWidth }} />
        </Stick>,
        host,
        () => {
          setTimeout(() => {
            const nodeElement = document.getElementById('node')
            const anchorElement = document.getElementById('anchor')

            const { left: nodeLeft } = nodeElement.getBoundingClientRect()
            const {
              left: anchorLeft,
              width: anchorWidth,
            } = anchorElement.getBoundingClientRect()

            expect(nodeLeft).toEqual(anchorLeft + anchorWidth)

            done()
          }, 100)
        }
      )
    })
  })
})
