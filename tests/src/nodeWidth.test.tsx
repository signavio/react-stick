import React from 'react'

import Stick from '../../src'
import { wrapRender } from './utils'

describe('stick node width', () => {
  const longText = new Array(50).fill('Lorem ipsum dolor sit amet.').join(' ')
  const anchor = <div />
  const node = (
    <div data-testid="node" style={{ wordBreak: 'break-all' }}>
      {longText}
    </div>
  )

  const PositionWrapper = ({ children }: { children: React.ReactNode }) => (
    <div style={{ width: 1000, height: 9999 }}>
      <div style={{ position: 'absolute', width: 100, left: 100 }}>
        {children}
      </div>
    </div>
  )

  const render = (stick: React.ReactElement) =>
    wrapRender(stick, PositionWrapper)

  const inlineOptions = [false, true]
  inlineOptions.forEach((inline) => {
    describe(`inline={${inline.toString()}}`, () => {
      it('should make sure that a left aligned node stretches to the right screen border', () => {
        render(
          <Stick
            inline={inline}
            position="middle right"
            align="middle left"
            node={node}
          >
            {anchor}
          </Stick>
        )

        cy.findByTestId('node').then((node) => {
          const { right } = node[0].getBoundingClientRect()
          expect(right).equal(document.documentElement?.scrollWidth)
        })
      })

      it('should make sure that a right aligned node stretches to the left screen border', () => {
        render(
          <Stick
            inline={inline}
            position="middle left"
            align="middle right"
            node={node}
          >
            {anchor}
          </Stick>
        )
        cy.findByTestId('node').then((node) => {
          const { left } = node[0].getBoundingClientRect()

          expect(left).equal(0)
        })
      })

      describe('sameWidth={true}', () => {
        it('should make sure that the stick node has the same width as the anchor', () => {
          render(
            <Stick inline={inline} sameWidth node={node}>
              {anchor}
            </Stick>
          )
          cy.findByTestId('node').then((node) => {
            const { width } = node[0].getBoundingClientRect()
            expect(width).equal(100)
          })
        })
      })
    })
  })
})
