import expect, { createSpy } from 'expect'
import React, { cloneElement } from 'react'
import { render as renderBase, unmountComponentAtNode } from 'react-dom'

import Stick from 'src/'

describe('`onClickOutside` event', () => {
  let host

  const anchor = <div id="anchor" />
  const node = <div id="node" />

  // wrap render to invoke callback only after the node has actually been mounted
  const render = (stick, host, callback) => {
    let called = false
    renderBase(
      cloneElement(stick, {
        node: cloneElement(stick.props.node, {
          ref: el => !!el && !called && window.setTimeout(callback, 1),
        }),
      }),
      host
    )
  }

  beforeEach(() => {
    host = document.createElement('div')
    document.body.appendChild(host)
  })

  afterEach(() => {
    unmountComponentAtNode(host)
    document.body.removeChild(host)
  })

  it('should call `onClickOutside` on click on any element outside of the stick node an anchor element', done => {
    const spy = createSpy()
    render(
      <Stick onClickOutside={spy} node={node}>
        {anchor}
      </Stick>,
      host,
      () => {
        const outsideNode = document.createElement('div')
        document.body.appendChild(outsideNode)
        outsideNode.click()
        expect(spy).toHaveBeenCalled()
        spy.reset()

        document.body.click()
        expect(spy).toHaveBeenCalled()
        done()
      }
    )
  })

  it('should not call `onClickOutside` on click on the anchor element or stick node', done => {
    const spy = createSpy()
    render(
      <Stick onClickOutside={spy} node={node}>
        {anchor}
      </Stick>,
      host,
      () => {
        document.getElementById('anchor').click()
        expect(spy).toNotHaveBeenCalled()

        document.getElementById('node').click()
        expect(spy).toNotHaveBeenCalled()

        done()
      }
    )
  })

  const inlineOptions = [false, true]
  inlineOptions.forEach(outerInline => {
    inlineOptions.forEach(innerInline => {
      describe(`<Stick ${innerInline ? 'inline ' : ''}/> in node of <Stick ${
        outerInline ? 'inline ' : ''
      }/>`, () => {
        it('should not call `onClickOutside` on click on the nested stick node', done => {
          const spy = createSpy()
          render(
            <Stick
              inline={outerInline}
              onClickOutside={spy}
              node={
                <div id="node">
                  <Stick inline={innerInline} node={<div id="nested-node" />}>
                    <span>foo</span>
                  </Stick>
                </div>
              }
            >
              <div />
            </Stick>,
            host,
            () => {
              document.getElementById('nested-node').click()
              expect(spy).toNotHaveBeenCalled()
              done()
            }
          )
        })
      })
    })
  })
})
