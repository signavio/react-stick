import invariant from 'invariant'
import React from 'react'

import Stick from '../../src/'
import { wrapRender } from './utils'

describe('updates', () => {
  const anchor = <div data-testid="anchor" />
  const node = <div data-testid="node" />

  const PositionWrapper = ({ children }: { children: React.ReactNode }) => (
    <div style={{ width: 10, height: 10 }}>{children}</div>
  )

  // wrap render to invoke callback only after the node has actually been mounted
  const render = (stick: React.ReactElement) =>
    wrapRender(stick, PositionWrapper)

  it('should work if the node is only provided after the initial mount', () => {
    render(
      <Stick position="middle right" node={null}>
        {anchor}
      </Stick>
    ).then(({ rerender }) =>
      rerender(
        <Stick position="middle right" node={node}>
          {anchor}
        </Stick>
      )
    )

    cy.findByTestId('node').then((node) => {
      const { left, top } = node[0].getBoundingClientRect()

      expect(left).equal(18)
      expect(top).equal(8)
    })
  })

  it('should unmount node container if no node is passed anymore', () => {
    render(<Stick node={node}>{anchor}</Stick>).then(({ rerender }) => {
      cy.document()
        .then((document) => {
          const body = document.body

          invariant(body, 'No body element present.')

          return body.childElementCount
        })
        .as('bodyChildrenCountWithStick')

      rerender(<Stick node={null}>{anchor}</Stick>)

      cy.findByTestId('node').should('not.exist')

      cy.get<number>('@bodyChildrenCountWithStick').then(
        (bodyChildrenCountWithStick) => {
          cy.document().then((document) => {
            expect(document.body?.childElementCount).to.be.equal(
              bodyChildrenCountWithStick - 1
            )
          })
        }
      )
    })
  })

  it('should correctly apply `sameWidth` if set after initial mount', () => {
    render(<Stick node={node}>{anchor}</Stick>).then(({ rerender }) =>
      rerender(
        <Stick node={node} sameWidth>
          {anchor}
        </Stick>
      )
    )

    cy.findByTestId('node').then((node) => {
      // we have to wait for first measure to be applied
      const { width } = node[0].getBoundingClientRect()

      expect(width).equal(10)
    })
  })

  it('should correctly handle clearing of `sameWidth` after initial mount', () => {
    render(
      <Stick sameWidth node={node}>
        {anchor}
      </Stick>
    ).then(({ rerender }) => rerender(<Stick node={node}>{anchor}</Stick>))

    cy.findByTestId('node').then((node) => {
      const { width } = node[0].getBoundingClientRect()
      expect(width).equal(0) // empty content means zero width
    })
  })

  it('should handle switching to `updateOnAnimationFrame` correctly', () => {
    render(
      <Stick node={node} position="middle right">
        {anchor}
      </Stick>
    ).then(({ rerender }) =>
      rerender(
        <Stick node={node} position="middle right" updateOnAnimationFrame>
          {anchor}
        </Stick>
      )
    )

    cy.findByTestId('node').then((node) => {
      const { left, top } = node[0].getBoundingClientRect()

      expect(left).equal(18)
      expect(top).equal(8)
    })
  })

  it('should handle switching back from `updateOnAnimationFrame` correctly', () => {
    render(
      <Stick node={node} position="middle right" updateOnAnimationFrame>
        {anchor}
      </Stick>
    ).then(({ rerender }) =>
      rerender(
        <Stick node={node} position="middle right">
          {anchor}
        </Stick>
      )
    )

    cy.findByTestId('node').then((node) => {
      const { left, top } = node[0].getBoundingClientRect()

      expect(left).equal(18)
      expect(top).equal(8)
    })
  })
})
