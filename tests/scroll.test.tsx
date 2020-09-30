import expect from 'expect'
import React from 'react'

import { render as renderBase } from '@testing-library/react'

import Stick from '../src/'

describe('positioning in scrolling window', () => {
  let fixedElement

  const longText = new Array(50).fill('Lorem ipsum dolor sit amet.').join(' ')
  const anchor = <div data-testid="anchor" />
  const node = <div data-testid="node">{longText}</div>

  const PositionWrapper = (
    { children } // sets documentElement's scroll width to 1008
  ) => (
    <div style={{ width: 1000, height: 10000 }}>
      <div style={{ position: 'absolute', height: 0, top: 5000 }}>
        {children}
      </div>
    </div>
  )

  const render = (stick) => renderBase(stick, { wrapper: PositionWrapper })

  beforeEach(() => {
    fixedElement = document.createElement('div')
    fixedElement.style.position = 'fixed'
    fixedElement.style.top = '0'

    document.body.appendChild(fixedElement)

    window.scrollTo(0, 0)
  })

  afterEach(() => {
    document.body.removeChild(fixedElement)
  })

  it('should keep the correct the node position when scrolling', () => {
    const { getByTestId } = render(
      <Stick position="bottom left" align="top left" node={node}>
        {anchor}
      </Stick>
    )

    const { top } = getByTestId('node').getBoundingClientRect()
    expect(top).toEqual(5000)

    window.scrollTo(0, 3000)

    // getBoundingClientRect takes the scrolling amount into account
    const { top: topAfterScroll } = getByTestId('node').getBoundingClientRect()
    expect(topAfterScroll).toEqual(2000) // 5000 absolute position - 3000 scroll top
  })

  it('should keep the correct the node position when transported to a fixed container', () => {
    const { getByTestId } = render(
      <Stick
        position="bottom left"
        align="top left"
        node={node}
        transportTo={fixedElement}
      >
        {anchor}
      </Stick>
    )

    const { top } = getByTestId('node').getBoundingClientRect()
    expect(top).toEqual(5000)

    window.scrollTo(0, 3000)

    // in the fixed transport target, the scrolling of the viewport should have no effect
    const { top: topAfterScroll } = getByTestId('node').getBoundingClientRect()
    expect(topAfterScroll).toEqual(5000)
  })
})
