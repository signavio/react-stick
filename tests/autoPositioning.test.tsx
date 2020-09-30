import expect from 'expect'
import React from 'react'

import { fireEvent } from '@testing-library/react'

import Stick from '../src'
import { render } from './utils'

const windowHeight = window.innerHeight
const windowWidth = window.innerWidth

describe('autoPositioning', () => {
  const node = <div data-testid="node" style={{ height: 100, width: 100 }} />
  const anchor = (
    <div data-testid="anchor" style={{ height: 100, width: 100 }} />
  )

  describe('vertical', () => {
    it('should move the node from bottom to top if there is not enough space at the bottom.', () => {
      const { getByTestId } = render(
        <Stick
          autoFlipVertically
          position="bottom center"
          node={node}
          style={{ marginTop: windowHeight }}
        >
          {anchor}
        </Stick>
      )

      const { top: nodeTop, height: nodeHeight } = getByTestId(
        'node'
      ).getBoundingClientRect()
      const { top: anchorTop } = getByTestId('anchor').getBoundingClientRect()

      expect(anchorTop).toEqual(nodeTop + nodeHeight)
    })

    it('should move the node back to its original intended position if space clears up (initial position: "bottom center").', () => {
      const { getByTestId, rerender } = render(
        <Stick
          autoFlipVertically
          position="bottom center"
          node={node}
          style={{ marginTop: windowHeight }}
        >
          {anchor}
        </Stick>
      )

      rerender(
        <Stick
          autoFlipVertically
          position="bottom center"
          node={node}
          style={{ marginTop: 0 }}
        >
          {anchor}
        </Stick>
      )

      fireEvent.scroll(window)

      const { top: nodeTop } = getByTestId('node').getBoundingClientRect()
      const { top: anchorTop, height: anchorHeight } = getByTestId(
        'anchor'
      ).getBoundingClientRect()

      console.log(anchorTop)

      expect(nodeTop).toEqual(anchorTop + anchorHeight)
    })

    it('should move the node back to its original intended position if space clears up (initial position: "top center").', () => {
      const { getByTestId, rerender } = render(
        <Stick autoFlipVertically position="top center" node={node}>
          {anchor}
        </Stick>
      )

      rerender(
        <Stick
          autoFlipVertically
          position="top center"
          node={node}
          style={{ marginTop: windowHeight }}
        >
          {anchor}
        </Stick>
      )

      fireEvent.scroll(window)

      const { top: nodeTop, height: nodeHeight } = getByTestId(
        'node'
      ).getBoundingClientRect()
      const { top: anchorTop } = getByTestId('anchor').getBoundingClientRect()

      expect(anchorTop).toEqual(nodeTop + nodeHeight)
    })

    it('should not move the node from top to bottom if there is not enough space a the top.', () => {
      const { getByTestId } = render(
        <Stick
          autoFlipVertically
          position="top center"
          node={node}
          style={{ marginTop: windowHeight }}
        >
          {anchor}
        </Stick>
      )

      const { top: nodeTop, height: nodeHeight } = getByTestId(
        'node'
      ).getBoundingClientRect()
      const { top: anchorTop } = getByTestId('anchor').getBoundingClientRect()

      expect(anchorTop).toEqual(nodeTop + nodeHeight)
    })

    it('should not move the node from top to bottom if there is neither enough space at the top nor the botom.', () => {
      const { getByTestId } = render(
        <Stick
          autoFlipVertically
          position="top center"
          node={node}
          style={{ height: windowHeight }}
        >
          {anchor}
        </Stick>
      )

      const { top: nodeTop, height: nodeHeight } = getByTestId(
        'node'
      ).getBoundingClientRect()
      const { top: anchorTop } = getByTestId('anchor').getBoundingClientRect()

      expect(anchorTop).toEqual(nodeTop + nodeHeight)
    })

    it('should not move the node from bottom to top if there is neither enough space at the bottom nor the top.', () => {
      const { getByTestId } = render(
        <Stick autoFlipVertically position="bottom center" node={node}>
          <div
            data-testid="anchor"
            style={{ width: 100, height: windowHeight }}
          />
        </Stick>
      )

      const { top: nodeTop } = getByTestId('node').getBoundingClientRect()
      const { top: anchorTop, height: anchorHeight } = getByTestId(
        'anchor'
      ).getBoundingClientRect()

      expect(nodeTop).toEqual(anchorTop + anchorHeight)
    })
  })

  describe('horizontal', () => {
    it('should move the node from left to right if there is not enough space at the left.', () => {
      const { getByTestId } = render(
        <Stick autoFlipHorizontally position="middle left" node={node}>
          {anchor}
        </Stick>
      )

      const { left: nodeLeft } = getByTestId('node').getBoundingClientRect()
      const { left: anchorLeft, width: anchorWidth } = getByTestId(
        'anchor'
      ).getBoundingClientRect()

      expect(nodeLeft).toEqual(anchorLeft + anchorWidth)
    })

    it('should move the node back to its original intended position if space clears up (initial position: "middle right").', () => {
      const { getByTestId, rerender } = render(
        <Stick
          autoFlipHorizontally
          position="middle right"
          node={node}
          style={{ marginLeft: windowWidth }}
        >
          {anchor}
        </Stick>
      )

      rerender(
        <Stick
          autoFlipHorizontally
          position="middle right"
          node={node}
          style={{ marginLeft: 0 }}
        >
          {anchor}
        </Stick>
      )

      fireEvent.scroll(window)

      const { left: nodeLeft } = getByTestId('node').getBoundingClientRect()
      const { left: anchorLeft, width: anchorWidth } = getByTestId(
        'anchor'
      ).getBoundingClientRect()

      expect(nodeLeft).toEqual(anchorLeft + anchorWidth)
    })

    it('should move the node back to its original intended position if space clears up (initial position: "middle left").', () => {
      const { getByTestId, rerender } = render(
        <Stick autoFlipHorizontally position="middle left" node={node}>
          {anchor}
        </Stick>
      )

      rerender(
        <Stick
          autoFlipHorizontally
          position="middle left"
          style={{
            marginLeft: windowWidth,
          }}
          node={node}
        >
          {anchor}
        </Stick>
      )

      fireEvent.scroll(window)

      const { left: nodeLeft, width: nodeWidth } = getByTestId(
        'node'
      ).getBoundingClientRect()
      const { left: anchorLeft, width: anchorWidth } = getByTestId(
        'anchor'
      ).getBoundingClientRect()

      console.log(nodeWidth, nodeLeft, anchorWidth, anchorLeft)

      expect(anchorLeft).toEqual(nodeLeft + nodeWidth)
    })

    it('should move the node from right to left if there is not enough space a the right.', () => {
      const { getByTestId } = render(
        <Stick
          autoFlipHorizontally
          position="middle right"
          node={node}
          style={{ marginLeft: windowWidth }}
        >
          {anchor}
        </Stick>
      )

      const { left: nodeLeft, width: nodeWidth } = getByTestId(
        'node'
      ).getBoundingClientRect()
      const { left: anchorLeft } = getByTestId('anchor').getBoundingClientRect()

      expect(anchorLeft).toEqual(nodeLeft + nodeWidth)
    })

    it('should not move the node from left to right if there is neither enough space at the left nor the right.', () => {
      const { getByTestId } = render(
        <Stick
          autoFlipHorizontally
          position="middle left"
          node={node}
          style={{ width: windowWidth }}
        >
          {anchor}
        </Stick>
      )

      const { left: nodeLeft, width: nodeWidth } = getByTestId(
        'node'
      ).getBoundingClientRect()
      const { left: anchorLeft } = getByTestId('anchor').getBoundingClientRect()

      expect(anchorLeft).toEqual(nodeLeft + nodeWidth)
    })

    it('should not move the node from right to left if there is neither enough space at the right nor the left.', () => {
      const { getByTestId } = render(
        <Stick autoFlipHorizontally position="middle right" node={node}>
          <div
            data-testid="anchor"
            style={{ height: 100, width: windowWidth }}
          />
        </Stick>
      )

      const { left: nodeLeft } = getByTestId('node').getBoundingClientRect()
      const { left: anchorLeft, width: anchorWidth } = getByTestId(
        'anchor'
      ).getBoundingClientRect()

      expect(nodeLeft).toEqual(anchorLeft + anchorWidth)
    })
  })
})
