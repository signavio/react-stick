import React from 'react'

import Stick from '../../../src'

import Regression from './Regression'

const Anchor = ({ width, children }) => (
  <div
    style={{
      height: 18,
      color: 'white',
      width,
      backgroundColor: 'rgb(24, 170, 177)',
    }}
  >
    {children}
  </div>
)

const Node = ({ children }) => (
  <div
    style={{
      backgroundColor: '#ae0d5c',
      color: 'white',
      minHeight: 18,
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
      description="Stick node must have the same width as the anchor element, if `sameWidth` prop is set"
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
        <Stick sameWidth position="bottom center" node={<Node />}>
          <Anchor>The stick node below should have the same width</Anchor>
        </Stick>
        <Stick sameWidth inline position="bottom center" node={<Node />}>
          <Anchor>
            The inline stick node below should have the same width
          </Anchor>
        </Stick>
        <Stick
          position="bottom center"
          sameWidth
          node={
            <Node>This text should break to respect the anchor's width</Node>
          }
        >
          <Anchor width={100} />
        </Stick>
      </div>
    </Regression>
  )
}
