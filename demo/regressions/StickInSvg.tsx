import React from 'react'

import Stick from '../../../src'
import Regression from './Regression'

export default function SameWidth() {
  return (
    <Regression
      allBrowsers
      version="1.0.0"
      fixed
      title="SVG node as anchor"
      description="Stick should also be usable inside an SVG"
    >
      <svg width="400" height="200">
        <Stick
          component="g"
          position={['top', 'center']}
          node={
            <div
              style={{
                height: 20,
                width: 20,
                backgroundColor: '#ae0d5c',
              }}
            />
          }
        >
          <ellipse
            cx="200"
            cy="100"
            rx="100"
            ry="50"
            style={{ fill: 'rgb(24, 170, 177)' }}
          />
        </Stick>
      </svg>
    </Regression>
  )
}
