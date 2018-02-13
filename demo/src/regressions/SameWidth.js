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

export default function SameWidth() {
  return (
    <Regression
      allBrowsers
      fixed
      title="Same width"
      description="Sticked node must have the same width as the anchor element, if `sameWidth` prop is set"
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          height: 200,
          marginRight: 250,
        }}
      >
        <Stick sameWidth position="middle right" node={<Node />}>
          <Anchor width={150} />
        </Stick>
        <Stick
          position="middle right"
          sameWidth
          node={
            <Node>
              This text should break to respect the sticked node width
            </Node>
          }
        >
          <Anchor width={50} />
        </Stick>
      </div>
    </Regression>
  )
}
