import React, { cloneElement } from 'react'
import { render as renderBase } from 'react-dom'

// wrap render to invoke callback only after the node has actually been mounted
export const render = (stick, host, callback) => {
  let called = false
  renderBase(
    // wrap in inline-block container so that the stick container adjusts to anchor size
    <div style={{ display: 'inline-block ' }}>
      {cloneElement(stick, {
        node: cloneElement(stick.props.node, {
          ref: el => !!el && !called && window.setTimeout(callback, 1),
        }),
      })}
    </div>,
    host
  )
}
