import React from 'react'
import { mount } from '@cypress/react'

import Stick from '../../src/'

describe('`onClickOutside` event', () => {
  const anchor = <div data-testid="anchor" />
  const node = <div data-testid="node" />

  it('should call `onClickOutside` on click on any element outside of the stick node an anchor element', () => {
    const spy = cy.stub().as('spy')
    mount(
      <div data-testid="container">
        <Stick onClickOutside={spy} node={node}>
          {anchor}
        </Stick>
      </div>
    )

    cy.findByTestId('container').click({ force: true })
    cy.get('@spy')
      .should('have.been.called')
      .then(() => spy.reset())

    cy.get('body').click({ force: true })

    cy.get('@spy').should('have.been.called')
  })

  it('should call `onClickOutside` on click on SVGElement outside of the stick node an anchor element', () => {
    const spy = cy.stub().as('spy')
    mount(
      <div data-testid="container">
        <Stick onClickOutside={spy} node={node}>
          {anchor}
        </Stick>
        <svg
          viewBox="0 0 300 100"
          xmlns="http://www.w3.org/2000/svg"
          stroke="red"
          fill="grey"
          data-testid="svg-element"
        >
          <circle cx="50" cy="50" r="40" />
        </svg>
      </div>
    )

    cy.findByTestId('svg-element').click({ force: true })
    cy.get('@spy')
      .should('have.been.called')
      .then(() => spy.reset())

    cy.get('body').click({ force: true })

    cy.get('@spy').should('have.been.called')
  })

  it('should not call `onClickOutside` on click on the anchor element or stick node', () => {
    const spy = cy.stub().as('spy')

    mount(
      <Stick onClickOutside={spy} node={node}>
        {anchor}
      </Stick>
    )
    cy.findByTestId('anchor').click({ force: true })
    cy.get('@spy')
      .should('not.have.been.called')
      .then(() => spy.reset())

    cy.findByTestId('node').click({ force: true })
    cy.get('@spy').should('not.have.been.called')
  })

  const inlineOptions = [false, true]
  inlineOptions.forEach((outerInline) => {
    inlineOptions.forEach((innerInline) => {
      describe(`<Stick ${innerInline ? 'inline ' : ''}/> in node of <Stick ${
        outerInline ? 'inline ' : ''
      }/>`, () => {
        it('should not call `onClickOutside` on click on the nested stick node', () => {
          const spy = cy.stub().as('spy')
          mount(
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

          cy.findByTestId('nested-node').click({ force: true })
          cy.get('@spy').should('not.have.been.called')
        })
      })
    })
  })
})
