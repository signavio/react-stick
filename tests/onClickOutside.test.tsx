import React from 'react'

import { fireEvent, render } from '@testing-library/react'

import Stick from '../src/'

describe('`onClickOutside` event', () => {
  const anchor = <div data-testid="anchor" />
  const node = <div data-testid="node" />

  it('should call `onClickOutside` on click on any element outside of the stick node an anchor element', () => {
    const spy = jest.fn()
    const { container } = render(
      <Stick onClickOutside={spy} node={node}>
        {anchor}
      </Stick>
    )

    fireEvent.click(container)

    expect(spy).toHaveBeenCalled()
    spy.mockReset()

    document.body?.click()
    expect(spy).toHaveBeenCalled()
  })

  it('should not call `onClickOutside` on click on the anchor element or stick node', () => {
    const spy = jest.fn()
    const { getByTestId } = render(
      <Stick onClickOutside={spy} node={node}>
        {anchor}
      </Stick>
    )

    fireEvent.click(getByTestId('anchor'))
    expect(spy).not.toHaveBeenCalled()

    fireEvent.click(getByTestId('node'))
    expect(spy).not.toHaveBeenCalled()
  })

  const inlineOptions = [false, true]
  inlineOptions.forEach((outerInline) => {
    inlineOptions.forEach((innerInline) => {
      describe(`<Stick ${innerInline ? 'inline ' : ''}/> in node of <Stick ${
        outerInline ? 'inline ' : ''
      }/>`, () => {
        it('should not call `onClickOutside` on click on the nested stick node', () => {
          const spy = jest.fn()
          const { getByTestId } = render(
            <Stick
              inline={outerInline}
              onClickOutside={spy}
              node={
                <Stick
                  inline={innerInline}
                  node={<div data-testid="nested-node" />}
                >
                  <span>foo</span>
                </Stick>
              }
            >
              <div />
            </Stick>
          )

          fireEvent.click(getByTestId('nested-node'))

          expect(spy).not.toHaveBeenCalled()
        })
      })
    })
  })
})
