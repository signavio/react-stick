import React, { PropsWithChildren } from 'react'

import Stick from '../../../es'
import Regression from './Regression'

function ScrollPosition() {
  return (
    <Regression
      fixed
      allBrowsers
      version="3.0.3"
      title="Node should scroll with anchor node"
      description="Scroll to the side. The node should move with the anchor node."
    >
      <div style={{ overflow: 'auto', height: 200, border: '1px solid black' }}>
        <div
          style={{
            width: 5000,
            height: 5000,
            marginLeft: 20,
            marginTop: 20,
            display: 'flex',
            alignItems: 'flex-start',
          }}
        >
          <Stick
            node={<Node>This node should always stick with its anchor</Node>}
          >
            <Anchor>
              Scroll to the right. The node should move with this element.
            </Anchor>
          </Stick>
        </div>
      </div>
    </Regression>
  )
}

const Anchor = ({ children }: PropsWithChildren<{}>) => (
  <div
    style={{
      padding: 10,
      backgroundColor: 'rgb(24, 170, 177)',
      color: 'white',
    }}
  >
    {children}
  </div>
)

const Node = ({ children }: PropsWithChildren<{}>) => (
  <div
    style={{
      backgroundColor: '#ae0d5c',
      color: 'white',
      padding: 10,
    }}
  >
    {children}
  </div>
)

export default ScrollPosition
