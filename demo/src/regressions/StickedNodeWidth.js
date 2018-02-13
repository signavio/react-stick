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
      fixed
      version="1.0.0"
      title="Sticked node width"
      description="The sticked node should not line-break just because the anchor node is small. The sticked node must only line-break if it would not fit onto the screen otherwise."
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
          <Anchor width={150} />
        </Stick>

        <div style={{ position: 'absolute', right: 150 }}>
          <Stick
            position="middle right"
            node={
              <Node>
                This text must line-break as it would reach off-screen otherwise
              </Node>
            }
          >
            <Anchor width={100} />
          </Stick>
        </div>
      </div>
    </Regression>
  )
}
