import React from 'react'

import Stick from '../../../src'

import Regression from './Regression'

const Anchor = ({ width }) => (
  <div
    style={{
      height: 15,
      width,
      backgroundColor: 'rgb(24, 170, 177)',
    }}
  />
)

const Node = ({ children }) => (
  <div
    style={{
      backgroundColor: '#ae0d5c',
      color: 'white',
    }}
  >
    {children}
  </div>
)

export default function StickedNodeWidth() {
  return (
    <Regression
      allBrowsers
      open
      version="1.0.0"
      title="Sticked node width"
      description="The sticked node should not line-break just because the anchor node is small."
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          height: 200,
        }}
      >
        <Stick
          position="middle right"
          node={<Node>This text should stay on one line</Node>}
        >
          <Anchor width={15} />
        </Stick>

        <Stick
          position="middle right"
          node={<Node>This text should stay on one line</Node>}
        >
          <Anchor width={50} />
        </Stick>

        <Stick
          position="middle right"
          node={<Node>This text should stay on one line</Node>}
        >
          <Anchor width={150} />
        </Stick>
      </div>
    </Regression>
  )
}
