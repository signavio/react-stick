import React from 'react'

import Stick from '../../src/'
import { wrapRender } from './utils'

describe('customize wrapper component', () => {
  const node = <div data-testid="node" />

  const SvgWrapper = ({ children }: { children: React.ReactNode }) => (
    <svg width="400" height="200">
      {children}
    </svg>
  )
  // wrap render in an svg element
  const render = (stick: React.ReactElement) => wrapRender(stick, SvgWrapper)

  it('should be possible to render in SVG by passing `"g"` as `component`', () => {
    render(
      <Stick component="g" position="top center" node={node}>
        <ellipse
          cx="200"
          cy="100"
          rx="100"
          ry="50"
          style={{ fill: 'rgb(24, 170, 177)' }}
        />
      </Stick>
    )

    cy.findByTestId('node').then((node) => {
      const { left, top } = node[0].getBoundingClientRect()
      expect(left).equal(208)
      expect(top).equal(58)
    })
  })
})
