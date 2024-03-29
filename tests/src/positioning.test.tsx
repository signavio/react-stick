import invariant from 'invariant'
import React from 'react'

import Stick from '../../src/'
import {
  type AlignT,
  type HorizontalTargetT,
  type PositionT,
  type VerticalTargetT,
} from '../../src/types'
import { render } from './utils'

const getPosition = (
  vertical: VerticalTargetT,
  horizontal: HorizontalTargetT
): PositionT => {
  const position = [vertical, horizontal].join(' ')

  invariant(
    position === 'bottom left' ||
      position === 'bottom center' ||
      position === 'bottom right' ||
      position === 'middle left' ||
      position === 'middle center' ||
      position === 'middle right' ||
      position === 'top left' ||
      position === 'top center' ||
      position === 'top right',
    `Invalid position: "${position}"`
  )

  return position
}

const getAlign = (
  vertical: VerticalTargetT,
  horizontal: HorizontalTargetT
): AlignT => {
  const align = [vertical, horizontal].join(' ')

  invariant(
    align === 'bottom left' ||
      align === 'bottom center' ||
      align === 'bottom right' ||
      align === 'middle left' ||
      align === 'middle center' ||
      align === 'middle right' ||
      align === 'top left' ||
      align === 'top center' ||
      align === 'top right',
    `Invalid align: "${align}"`
  )

  return align
}

describe('positioning', () => {
  const verticals: ReadonlyArray<VerticalTargetT> = ['top', 'middle', 'bottom']
  const horizontals: ReadonlyArray<HorizontalTargetT> = [
    'left',
    'center',
    'right',
  ]

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

  const widthFactor = (position: HorizontalTargetT) => {
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

  const heightFactor = (position: VerticalTargetT) => {
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

  const calcLeft = (position: HorizontalTargetT, align: HorizontalTargetT) =>
    BODY_PADDING +
    widthFactor(position) * ANCHOR_WIDTH -
    widthFactor(align) * NODE_WIDTH

  const calcTop = (position: VerticalTargetT, align: VerticalTargetT) =>
    BODY_PADDING +
    heightFactor(position) * ANCHOR_HEIGHT -
    heightFactor(align) * NODE_HEIGHT

  verticals.forEach((verticalPosition) => {
    horizontals.forEach((horizontalPosition) => {
      const position = getPosition(verticalPosition, horizontalPosition)

      describe(`position="${position}"`, () => {
        verticals.forEach((verticalAlign) => {
          horizontals.forEach((horizontalAlign) => {
            const align = getAlign(verticalAlign, horizontalAlign)

            const expectedLeft = calcLeft(horizontalPosition, horizontalAlign)
            const expectedTop = calcTop(verticalPosition, verticalAlign)

            describe(`align="${align}"`, () => {
              it(`should place at left: ${expectedLeft} top: ${expectedTop}`, () => {
                render(
                  <Stick node={node} position={position} align={align}>
                    {anchor}
                  </Stick>
                )

                cy.findByTestId('node').then((node) => {
                  const { left, top } = node[0].getBoundingClientRect()
                  expect(left).equal(expectedLeft)
                  expect(top).equal(expectedTop)
                })
              })

              it(`should place at left: ${expectedLeft} top: ${expectedTop} with \`inline\` prop`, () => {
                render(
                  <Stick inline node={node} position={position} align={align}>
                    {anchor}
                  </Stick>
                )

                cy.findByTestId('node').then((node) => {
                  const { left, top } = node[0].getBoundingClientRect()
                  expect(left).equal(expectedLeft)
                  expect(top).equal(expectedTop)
                })
              })
            })
          })
        })

        it('should use the correct default `align`', () => {
          const defaultAligns = {
            'top left': 'bottom left',
            'top center': 'bottom center',
            'top right': 'bottom right',
            'middle left': 'middle right',
            'middle center': 'middle center',
            'middle right': 'middle left',
            'bottom left': 'top left',
            'bottom center': 'top center',
            'bottom right': 'top right',
          } as const

          const stick = (
            <Stick node={node} position={position}>
              {anchor}
            </Stick>
          )
          const otherStick = (
            <Stick
              node={node}
              position={position}
              align={defaultAligns[position]}
            >
              {anchor}
            </Stick>
          )

          render(stick).then(({ rerender }) =>
            cy.findByTestId('node').then((node) => {
              const { left, top } = node[0].getBoundingClientRect()
              cy.wrap({ left, top }).as('stickPosition')
              return rerender(otherStick)
            })
          )

          cy.findByTestId('node').then((node) => {
            const { left: otherLeft, top: otherTop } =
              node[0].getBoundingClientRect()
            cy.get<{ left: number; top: number }>('@stickPosition').then(
              ({ left, top }) => {
                expect(left).to.be.equal(otherLeft)
                expect(top).to.be.equal(otherTop)
              }
            )
          })
        })
      })
    })
  })
})
