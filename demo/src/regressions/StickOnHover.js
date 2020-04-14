import { range } from 'lodash'
import React, { useState } from 'react'

import Stick from '../../../es'
import Regression from './Regression'

function StickOnHover() {
  return (
    <Regression
      allBrowsers
      fixed
      version="3.0.3"
      title="Node does not unmount on mouse leave"
      description="Move your mouse over the squares. When you're hovering one another node should be shown. However, there should always only be one node at the same time."
    >
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {range(100).map(i => (
          <div key={i} style={{ marginLeft: 20, marginBottom: 20 }}>
            <Popover />
          </div>
        ))}
      </div>
    </Regression>
  )
}

function Popover() {
  const [hover, setHover] = useState(false)

  return (
    <Stick
      position="top center"
      node={hover && <Node />}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Anchor />
    </Stick>
  )
}

const Anchor = () => (
  <div
    style={{
      height: 30,
      width: 30,
      backgroundColor: 'rgb(24, 170, 177)'
    }}
  />
)

const Node = ({ children }) => (
  <div
    style={{
      backgroundColor: '#ae0d5c',
      width: 10,
      height: 10
    }}
  >
    {children}
  </div>
)

export default StickOnHover
