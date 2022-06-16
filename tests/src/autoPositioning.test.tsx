import React from 'react'

import Stick from '../../src'
import { batchFindByTestId, render } from './utils'

const windowHeight = window.innerHeight
const windowWidth = window.innerWidth

describe('autoPositioning', () => {
  const node = <div data-testid="node" style={{ height: 100, width: 100 }} />
  const anchor = (
    <div data-testid="anchor" style={{ height: 100, width: 100 }} />
  )

  describe('vertical', () => {
    it('should move the node from bottom to top if there is not enough space at the bottom.', () => {
      render(
        <Stick
          autoFlipVertically
          position="bottom center"
          node={node}
          style={{ marginTop: windowHeight }}
        >
          {anchor}
        </Stick>
      )

      batchFindByTestId(['node', 'anchor']).then(([node, anchor]) => {
        const { top: nodeTop, height: nodeHeight } =
          node[0].getBoundingClientRect()
        const { top: anchorTop } = anchor[0].getBoundingClientRect()

        expect(anchorTop).equal(nodeTop + nodeHeight)
      })
    })

    it('should move the node back to its original intended position if space clears up (initial position: "bottom center").', () => {
      render(
        <Stick
          autoFlipVertically
          position="bottom center"
          node={node}
          style={{ marginTop: windowHeight }}
        >
          {anchor}
        </Stick>
      ).then(({ rerender }) =>
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
      )

      cy.window().then((window) => window.dispatchEvent(new Event('scroll')))

      batchFindByTestId(['node', 'anchor']).then(([node, anchor]) => {
        const { top: nodeTop } = node[0].getBoundingClientRect()
        const { top: anchorTop, height: anchorHeight } =
          anchor[0].getBoundingClientRect()

        console.log(anchorTop)

        expect(nodeTop).equal(anchorTop + anchorHeight)
      })
    })

    it('should move the node back to its original intended position if space clears up (initial position: "top center").', () => {
      render(
        <Stick autoFlipVertically position="top center" node={node}>
          {anchor}
        </Stick>
      ).then(({ rerender }) =>
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
      )

      cy.window().then((window) => window.dispatchEvent(new Event('scroll')))

      batchFindByTestId(['node', 'anchor']).then(([node, anchor]) => {
        const { top: nodeTop, height: nodeHeight } =
          node[0].getBoundingClientRect()
        const { top: anchorTop } = anchor[0].getBoundingClientRect()

        expect(anchorTop).equal(nodeTop + nodeHeight)
      })
    })

    it('should not move the node from top to bottom if there is not enough space a the top.', () => {
      render(
        <Stick
          autoFlipVertically
          position="top center"
          node={node}
          style={{ marginTop: windowHeight }}
        >
          {anchor}
        </Stick>
      )

      batchFindByTestId(['node', 'anchor']).then(([node, anchor]) => {
        const { top: nodeTop, height: nodeHeight } =
          node[0].getBoundingClientRect()
        const { top: anchorTop } = anchor[0].getBoundingClientRect()

        expect(anchorTop).equal(nodeTop + nodeHeight)
      })
    })

    it('should not move the node from top to bottom if there is neither enough space at the top nor the botom.', () => {
      render(
        <Stick
          autoFlipVertically
          position="top center"
          node={node}
          style={{ height: windowHeight }}
        >
          {anchor}
        </Stick>
      )

      batchFindByTestId(['node', 'anchor']).then(([node, anchor]) => {
        const { top: nodeTop, height: nodeHeight } =
          node[0].getBoundingClientRect()
        const { top: anchorTop } = anchor[0].getBoundingClientRect()

        expect(anchorTop).equal(nodeTop + nodeHeight)
      })
    })

    it('should not move the node from bottom to top if there is neither enough space at the bottom nor the top.', () => {
      render(
        <Stick autoFlipVertically position="bottom center" node={node}>
          <div
            data-testid="anchor"
            style={{ width: 100, height: windowHeight }}
          />
        </Stick>
      )
      batchFindByTestId(['node', 'anchor']).then(([node, anchor]) => {
        const { top: nodeTop } = node[0].getBoundingClientRect()
        const { top: anchorTop, height: anchorHeight } =
          anchor[0].getBoundingClientRect()

        expect(nodeTop).equal(anchorTop + anchorHeight)
      })
    })
  })

  describe('horizontal', () => {
    it('should move the node from left to right if there is not enough space at the left.', () => {
      render(
        <Stick autoFlipHorizontally position="middle left" node={node}>
          {anchor}
        </Stick>
      )
      batchFindByTestId(['node', 'anchor']).then(([node, anchor]) => {
        const { left: nodeLeft } = node[0].getBoundingClientRect()
        const { left: anchorLeft, width: anchorWidth } =
          anchor[0].getBoundingClientRect()

        expect(nodeLeft).equal(anchorLeft + anchorWidth)
      })
    })

    it('should move the node back to its original intended position if space clears up (initial position: "middle right").', () => {
      render(
        <Stick
          autoFlipHorizontally
          position="middle right"
          node={node}
          style={{ marginLeft: windowWidth }}
        >
          {anchor}
        </Stick>
      ).then(({ rerender }) =>
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
      )

      cy.window().then((window) => window.dispatchEvent(new Event('scroll')))
      batchFindByTestId(['node', 'anchor']).then(([node, anchor]) => {
        const { left: nodeLeft } = node[0].getBoundingClientRect()
        const { left: anchorLeft, width: anchorWidth } =
          anchor[0].getBoundingClientRect()

        expect(nodeLeft).equal(anchorLeft + anchorWidth)
      })
    })

    it('should move the node back to its original intended position if space clears up (initial position: "middle left").', () => {
      render(
        <Stick autoFlipHorizontally position="middle left" node={node}>
          {anchor}
        </Stick>
      ).then(({ rerender }) =>
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
      )

      cy.window().then((window) => window.dispatchEvent(new Event('scroll')))
      batchFindByTestId(['node', 'anchor']).then(([node, anchor]) => {
        const { left: nodeLeft, width: nodeWidth } =
          node[0].getBoundingClientRect()
        const { left: anchorLeft, width: anchorWidth } =
          anchor[0].getBoundingClientRect()

        console.log(nodeWidth, nodeLeft, anchorWidth, anchorLeft)

        expect(anchorLeft).equal(nodeLeft + nodeWidth)
      })
    })

    it('should move the node from right to left if there is not enough space a the right.', () => {
      render(
        <Stick
          autoFlipHorizontally
          position="middle right"
          node={node}
          style={{ marginLeft: windowWidth }}
        >
          {anchor}
        </Stick>
      )
      batchFindByTestId(['node', 'anchor']).then(([node, anchor]) => {
        const { left: nodeLeft, width: nodeWidth } =
          node[0].getBoundingClientRect()
        const { left: anchorLeft } = anchor[0].getBoundingClientRect()

        expect(anchorLeft).equal(nodeLeft + nodeWidth)
      })
    })

    it('should not move the node from left to right if there is neither enough space at the left nor the right.', () => {
      render(
        <Stick
          autoFlipHorizontally
          position="middle left"
          node={node}
          style={{ width: windowWidth }}
        >
          {anchor}
        </Stick>
      )
      batchFindByTestId(['node', 'anchor']).then(([node, anchor]) => {
        const { left: nodeLeft, width: nodeWidth } =
          node[0].getBoundingClientRect()
        const { left: anchorLeft } = anchor[0].getBoundingClientRect()

        expect(anchorLeft).equal(nodeLeft + nodeWidth)
      })
    })

    it('should not move the node from right to left if there is neither enough space at the right nor the left.', () => {
      render(
        <Stick autoFlipHorizontally position="middle right" node={node}>
          <div
            data-testid="anchor"
            style={{ height: 100, width: windowWidth }}
          />
        </Stick>
      )
      batchFindByTestId(['node', 'anchor']).then(([node, anchor]) => {
        const { left: nodeLeft } = node[0].getBoundingClientRect()
        const { left: anchorLeft, width: anchorWidth } =
          anchor[0].getBoundingClientRect()

        expect(nodeLeft).equal(anchorLeft + anchorWidth)
      })
    })
  })
})
