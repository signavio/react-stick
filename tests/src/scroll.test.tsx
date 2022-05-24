import React from 'react'

import Stick from '../../src'
import { wrapRender } from './utils'

describe('positioning in scrolling window', () => {
  let fixedElement: HTMLDivElement

  const longText = new Array(50).fill('Lorem ipsum dolor sit amet.').join(' ')
  const anchor = <div data-testid="anchor" />
  const node = <div data-testid="node">{longText}</div>

  const PositionWrapper = (
    { children }: { children: React.ReactNode } // sets documentElement's scroll width to 1008
  ) => (
    <div style={{ width: 1000, height: 10000 }}>
      <div style={{ position: 'absolute', height: 0, top: 5000 }}>
        {children}
      </div>
    </div>
  )

  const render = (stick: React.ReactElement) =>
    wrapRender(stick, PositionWrapper)

  beforeEach(() => {
    fixedElement = document.createElement('div')
    fixedElement.style.position = 'fixed'
    fixedElement.style.top = '0'

    cy.document().then((document) => document.body.appendChild(fixedElement))

    cy.window().then((window) => window.scrollTo(0, 0))
  })

  afterEach(() => {
    cy.document().then((document) => document.body.removeChild(fixedElement))
  })

  it.only('should keep the correct the node position when scrolling', () => {
    render(
      <Stick position="bottom left" align="top left" node={node}>
        {anchor}
      </Stick>
    )

    cy.findByTestId('node').then((node) => {
      const { top } = node[0].getBoundingClientRect()
      expect(top).equal(5000)
    })

    cy.window().then((window) => {
      window.scrollTo(0, 3000)
    })
    cy.findByTestId('node').then((node) => {
      // getBoundingClientRect takes the scrolling amount into account
      const { top: topAfterScroll } = node[0].getBoundingClientRect()
      expect(topAfterScroll).equal(2000) // 5000 absolute position - 3000 scroll top
    })
  })

  it('should keep the correct the node position when transported to a fixed container', () => {
    render(
      <Stick
        position="bottom left"
        align="top left"
        node={node}
        transportTo={fixedElement}
      >
        {anchor}
      </Stick>
    )

    cy.findByTestId('node').then((node) => {
      const { top } = node[0].getBoundingClientRect()
      expect(top).equal(5000)
    })

    cy.window().then((window) => {
      window.scrollTo(0, 3000)
    })

    cy.findByTestId('node').then((node) => {
      // in the fixed transport target, the scrolling of the viewport should have no effect
      const { top: topAfterScroll } = node[0].getBoundingClientRect()
      expect(topAfterScroll).equal(5000)
    })
  })
})
