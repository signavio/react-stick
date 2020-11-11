import expect from 'expect'
import React, { FunctionComponent, ReactElement } from 'react'

import { render as renderBase } from '@testing-library/react'

import Stick from '../src'

describe('customize wrapper component', () => {
  const node = <div data-testid="node" />

  const SvgWrapper: FunctionComponent<{}> = (props) => (
    <svg width="400" height="200" {...props} />
  )
  // wrap render in an svg element
  const render = (stick: ReactElement) =>
    renderBase(stick, { wrapper: SvgWrapper })

  it('should be possible to render in SVG by passing `"g"` as `component`', () => {
    const { getByTestId } = render(
      <Stick component="g" position={['top', 'center']} node={node}>
        <ellipse
          cx="200"
          cy="100"
          rx="100"
          ry="50"
          style={{ fill: 'rgb(24, 170, 177)' }}
        />
      </Stick>
    )

    const { left, top } = getByTestId('node').getBoundingClientRect()
    expect(left).toEqual(208)
    expect(top).toEqual(58)
  })
})
