import React, { PropsWithChildren } from 'react'

import Stick from '../../../es'
import Regression from './Regression'

const Anchor = ({ width }: PropsWithChildren<{ width?: number }>) => (
  <div
    style={{
      height: 15,
      width,
      backgroundColor: 'rgb(24, 170, 177)',
    }}
  />
)

const Node = ({ children }: PropsWithChildren<{}>) => (
  <div
    style={{
      backgroundColor: '#ae0d5c',
      color: 'white',
    }}
  >
    {children}
  </div>
)

const Examples = ({ inline }: { inline?: boolean }) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      height: 100,
      marginRight: 250,
    }}
  >
    <Stick
      inline={inline}
      position="middle right"
      node={<Node>This text should stay on one line</Node>}
    >
      <Anchor width={15} />
    </Stick>

    <Stick
      inline={inline}
      position="middle right"
      node={<Node>This text should stay on one line</Node>}
    >
      <Anchor width={150} />
    </Stick>

    <div style={{ position: 'absolute', right: 150 }}>
      <Stick
        inline={inline}
        position="middle right"
        node={
          <Node>
            This text must line-break as it would reach off-screen otherwise.
            After we've increased page width, this text needed to be extended a
            bit.
          </Node>
        }
      >
        <Anchor width={100} />
      </Stick>
    </div>
  </div>
)

export default function StickNodeWidth() {
  return (
    <Regression
      allBrowsers
      fixed
      version="1.0.0"
      title="Stick node width"
      description="The stick node should not line-break just because the anchor node is small. The stick node must only line-break if it would not fit onto the screen otherwise."
    >
      <Examples />
      <p>with `inline` prop:</p>
      <Examples inline />
    </Regression>
  )
}
