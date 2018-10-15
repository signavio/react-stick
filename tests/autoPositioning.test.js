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

  describe('vertical', () => {
    const node = <div id="node" style={{ height: 100, width: 100 }} />

    it('should move the node from bottom to top if there is not enough space at the bottom.', done => {
      const stick = (
        <Stick autoFlipVertically position="bottom center" node={node}>
          <div
            id="anchor"
            style={{
              height: 100,
              marginTop: windowHeight,
            }}
          />
        </Stick>
      )

      render(stick, host, () => {
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
      })
    })

    it('should move the node back to its original intended position if space clears up (initial position: "bottom center").', done => {
      render(
        <Stick autoFlipVertically position="bottom center" node={node}>
          <div
            id="anchor"
            style={{
              position: 'relative',
              height: 100,
              marginTop: windowHeight,
            }}
          />
        </Stick>,
        host,
        () => {
          setTimeout(() => {
            render(
              <Stick autoFlipVertically position="bottom center" node={node}>
                <div
                  id="anchor"
                  style={{
                    position: 'relative',
                    height: 100,
                    top: 0,
                  }}
                />
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
          <div
            id="anchor"
            style={{
              position: 'relative',
              height: 100,
            }}
          />
        </Stick>,
        host,
        () => {
          setTimeout(() => {
            render(
              <Stick autoFlipVertically position="top center" node={node}>
                <div
                  id="anchor"
                  style={{
                    position: 'relative',
                    height: 100,
                    marginTop: windowHeight,
                  }}
                />
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
      const stick = (
        <Stick autoFlipVertically position="top center" node={node}>
          <div
            id="anchor"
            style={{
              position: 'relative',
              marginTop: windowHeight,
            }}
          />
        </Stick>
      )

      render(stick, host, () => {
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

          const {
            top: nodeTop,
            height: nodeHeight,
          } = nodeElement.getBoundingClientRect()
          const { top: anchorTop } = anchorElement.getBoundingClientRect()

          expect(anchorTop).toEqual(nodeTop + nodeHeight)

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
          const {
            top: anchorTop,
            height: anchorHeight,
          } = anchorElement.getBoundingClientRect()

          expect(nodeTop).toEqual(anchorTop + anchorHeight)

          done()
        }, 100)
      })
    })
  })

  describe('horizontal', () => {
    const node = <div id="node" style={{ height: 100, width: 100 }} />

    it('should move the node from left to right if there is not enough space at the left.', done => {
      const stick = (
        <Stick autoFlipHorizontally position="middle left" node={node}>
          <div
            id="anchor"
            style={{
              height: 100,
              width: 100,
              left: 0,
            }}
          />
        </Stick>
      )

      render(stick, host, () => {
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
      })
    })

    it('should move the node back to its original intended position if space clears up (initial position: "middle right").', done => {
      render(
        <Stick autoFlipVertically position="middle right" node={node}>
          <div
            id="anchor"
            style={{
              height: 100,
              width: 100,
              marginLeft: windowWidth,
            }}
          />
        </Stick>,
        host,
        () => {
          setTimeout(() => {
            render(
              <Stick autoFlipVertically position="middle right" node={node}>
                <div
                  id="anchor"
                  style={{
                    height: 100,
                    width: 100,
                    marginLeft: 0,
                  }}
                />
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
          <div
            id="anchor"
            style={{
              height: 100,
              width: 100,
            }}
          />
        </Stick>,
        host,
        () => {
          setTimeout(() => {
            render(
              <Stick autoFlipHorizontally position="middle left" node={node}>
                <div
                  id="anchor"
                  style={{
                    height: 100,
                    width: 100,
                    marginLeft: windowWidth,
                  }}
                />
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
      const stick = (
        <Stick autoFlipHorizontally position="middle right" node={node}>
          <div
            id="anchor"
            style={{
              position: 'relative',
              height: 100,
              width: 100,

              marginLeft: windowWidth,
            }}
          />
        </Stick>
      )

      render(stick, host, () => {
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
      })
    })

    it('should not move the node from left to right if there is neither enough space at the left nor the right.', done => {
      const stick = (
        <Stick autoFlipHorizontally position="middle left" node={node}>
          <div
            id="anchor"
            style={{
              position: 'relative',
              height: 100,
              width: windowWidth,
            }}
          />
        </Stick>
      )

      render(stick, host, () => {
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
      })
    })

    it('should not move the node from right to left if there is neither enough space at the right nor the left.', done => {
      const stick = (
        <Stick autoFlipHorizontally position="middle right" node={node}>
          <div
            id="anchor"
            style={{
              position: 'relative',
              height: 100,
              width: windowWidth,
            }}
          />
        </Stick>
      )

      render(stick, host, () => {
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
      })
    })
  })
})
