import invariant from 'invariant'
import React, { FunctionComponent, ReactElement, ReactNode } from 'react'

import { render as renderBase } from '@testing-library/react'

import Stick from '../src/'

describe('updates', () => {
  const anchor = <div data-testid="anchor" />
  const node = <div data-testid="node" />

  const PositionWrapper: FunctionComponent<{}> = (props) => (
    <div style={{ width: 10, height: 10 }} {...props} />
  )

  // wrap render to invoke callback only after the node has actually been mounted
  const render = (stick: ReactElement) =>
    renderBase(stick, { wrapper: PositionWrapper })

  it('should work if the node is only provided after the initial mount', () => {
    const { rerender, getByTestId } = render(
      <Stick position={['middle', 'right']} node={null}>
        {anchor}
      </Stick>
    )

    rerender(
      <Stick position={['middle', 'right']} node={node}>
        {anchor}
      </Stick>
    )

    const { left, top } = getByTestId('node').getBoundingClientRect()

    expect(left).toEqual(18)
    expect(top).toEqual(8)
  })

  it('should unmount node container if no node is passed anymore', () => {
    const { rerender, queryByTestId } = render(
      <Stick node={node}>{anchor}</Stick>
    )

    const body = document.body

    invariant(body != null, 'No body element present.')

    const bodyChildrenCountWithStick = body.childElementCount

    rerender(<Stick node={null}>{anchor}</Stick>)

    expect(queryByTestId('node')).toBe(null)

    expect(body?.childElementCount).toBe(bodyChildrenCountWithStick - 1)
  })

  it('should correctly apply `sameWidth` if set after initial mount', () => {
    const { rerender, getByTestId } = render(
      <Stick node={node}>{anchor}</Stick>
    )

    rerender(
      <Stick node={node} sameWidth>
        {anchor}
      </Stick>
    )

    // we have to wait for first measure to be applied
    const { width } = getByTestId('node').getBoundingClientRect()

    expect(width).toEqual(10)
  })

  it('should correctly handle clearing of `sameWidth` after initial mount', () => {
    const { rerender, getByTestId } = render(
      <Stick sameWidth node={node}>
        {anchor}
      </Stick>
    )

    rerender(<Stick node={node}>{anchor}</Stick>)

    const { width } = getByTestId('node').getBoundingClientRect()
    expect(width).toEqual(0) // empty content means zero width
  })

  it('should handle switching to `updateOnAnimationFrame` correctly', () => {
    const { rerender, getByTestId } = render(
      <Stick node={node} position={['middle', 'right']}>
        {anchor}
      </Stick>
    )

    rerender(
      <Stick node={node} position={['middle', 'right']} updateOnAnimationFrame>
        {anchor}
      </Stick>
    )

    const { left, top } = getByTestId('node').getBoundingClientRect()

    expect(left).toEqual(18)
    expect(top).toEqual(8)
  })

  it('should handle switching back from `updateOnAnimationFrame` correctly', () => {
    const { rerender, getByTestId } = render(
      <Stick node={node} position={['middle', 'right']} updateOnAnimationFrame>
        {anchor}
      </Stick>
    )

    rerender(
      <Stick node={node} position={['middle', 'right']}>
        {anchor}
      </Stick>
    )

    const { left, top } = getByTestId('node').getBoundingClientRect()

    expect(left).toEqual(18)
    expect(top).toEqual(8)
  })
})
