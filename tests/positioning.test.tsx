import React from 'react'

import Stick, { Align, HorizontalAlign, Position, VerticalAlign } from '../src/'
import { render } from './utils'

describe('positioning', () => {
  const verticals: VerticalAlign[] = ['top', 'middle', 'bottom']
  const horizontals: HorizontalAlign[] = ['left', 'center', 'right']

  const BODY_PADDING = 8

  const NODE_WIDTH = 10
  const NODE_HEIGHT = 20
  const node = (
    <div
      data-testid="node"
      style={{ width: NODE_WIDTH, height: NODE_HEIGHT }}
    />
  )

  const ANCHOR_WIDTH = 30
  const ANCHOR_HEIGHT = 40
  const anchor = (
    <div
      data-testid="anchor"
      style={{ width: ANCHOR_WIDTH, height: ANCHOR_HEIGHT }}
    />
  )

  const widthFactor = (position: HorizontalAlign) => {
    switch (position) {
      case 'left':
        return 0
      case 'center':
        return 0.5
      case 'right':
        return 1
      default:
        throw new Error(`Invalid position "${position}"`)
    }
  }

  const heightFactor = (position: VerticalAlign) => {
    switch (position) {
      case 'top':
        return 0
      case 'middle':
        return 0.5
      case 'bottom':
        return 1
      default:
        throw new Error(`Invalid position "${position}"`)
    }
  }

  const calcLeft = (position: HorizontalAlign, align: HorizontalAlign) =>
    BODY_PADDING +
    widthFactor(position) * ANCHOR_WIDTH -
    widthFactor(align) * NODE_WIDTH

  const calcTop = (position: VerticalAlign, align: VerticalAlign) =>
    BODY_PADDING +
    heightFactor(position) * ANCHOR_HEIGHT -
    heightFactor(align) * NODE_HEIGHT

  verticals.forEach((verticalPosition) => {
    horizontals.forEach((horizontalPosition) => {
      const position: Position = [verticalPosition, horizontalPosition]

      describe(`position="${position}"`, () => {
        verticals.forEach((verticalAlign) => {
          horizontals.forEach((horizontalAlign) => {
            const align: Align = [verticalAlign, horizontalAlign]

            const expectedLeft = calcLeft(horizontalPosition, horizontalAlign)
            const expectedTop = calcTop(verticalPosition, verticalAlign)

            describe(`align="${align}"`, () => {
              it(`should place at left: ${expectedLeft} top: ${expectedTop}`, () => {
                const { getByTestId } = render(
                  <Stick node={node} position={position} align={align}>
                    {anchor}
                  </Stick>
                )

                const { left, top } = getByTestId(
                  'node'
                ).getBoundingClientRect()
                expect(left).toEqual(expectedLeft)
                expect(top).toEqual(expectedTop)
              })

              it(`should place at left: ${expectedLeft} top: ${expectedTop} with \`inline\` prop`, () => {
                const { getByTestId } = render(
                  <Stick inline node={node} position={position} align={align}>
                    {anchor}
                  </Stick>
                )

                const { left, top } = getByTestId(
                  'node'
                ).getBoundingClientRect()
                expect(left).toEqual(expectedLeft)
                expect(top).toEqual(expectedTop)
              })
            })
          })
        })

        it('should use the correct default `align`', () => {
          const defaultAligns: { [key: string]: Align } = {
            'top left': ['bottom', 'left'],
            'top center': ['bottom', 'center'],
            'top right': ['bottom', 'right'],
            'middle left': ['middle', 'right'],
            'middle center': ['middle', 'center'],
            'middle right': ['middle', 'left'],
            'bottom left': ['top', 'left'],
            'bottom center': ['top', 'center'],
            'bottom right': ['top', 'right'],
          }

          const stick = (
            <Stick node={node} position={position}>
              {anchor}
            </Stick>
          )
          const otherStick = (
            <Stick
              node={node}
              position={position}
              align={defaultAligns[position.join(' ')]}
            >
              {anchor}
            </Stick>
          )

          const { rerender, getByTestId } = render(stick)

          const { left, top } = getByTestId('node').getBoundingClientRect()

          rerender(otherStick)

          const { left: otherLeft, top: otherTop } = getByTestId(
            'node'
          ).getBoundingClientRect()

          expect(left).toBe(otherLeft)
          expect(top).toBe(otherTop)
        })
      })
    })
  })
})