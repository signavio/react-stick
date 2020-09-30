import expect from 'expect'
import React from 'react'

import { render as renderBase } from '@testing-library/react'

import Stick from '../src/'

describe('stick node width', () => {
  const longText = new Array(50).fill('Lorem ipsum dolor sit amet.').join(' ')
  const anchor = <div />
  const node = (
    <div data-testid="node" style={{ wordBreak: 'break-all' }}>
      {longText}
    </div>
  )

  const PositionWrapper = ({ children }) => (
    <div style={{ width: 1000, height: 9999 }}>
      <div style={{ position: 'absolute', width: 100, left: 100 }}>
        {children}
      </div>
    </div>
  )

  const render = (stick) => renderBase(stick, { wrapper: PositionWrapper })

  const inlineOptions = [false, true]
  inlineOptions.forEach((inline) => {
    describe(`inline={${inline.toString()}}`, () => {
      it('should make sure that a left aligned node stretches to the right screen border', () => {
        const { getByTestId } = render(
          <Stick
            inline={inline}
            position="middle right"
            align="middle left"
            node={node}
          >
            {anchor}
          </Stick>
        )

        const { right } = getByTestId('node').getBoundingClientRect()
        expect(right).toEqual(document.documentElement?.scrollWidth)
      })

      it('should make sure that a right aligned node stretches to the left screen border', () => {
        const { getByTestId } = render(
          <Stick
            inline={inline}
            position="middle left"
            align="middle right"
            node={node}
          >
            {anchor}
          </Stick>
        )

        const { left } = getByTestId('node').getBoundingClientRect()

        expect(left).toEqual(0)
      })

      describe('sameWidth={true}', () => {
        it('should make sure that the stick node has the same width as the anchor', () => {
          const { getByTestId } = render(
            <Stick inline={inline} sameWidth node={node}>
              {anchor}
            </Stick>
          )

          const { width } = getByTestId('node').getBoundingClientRect()
          expect(width).toEqual(100)
        })
      })
    })
  })
})
