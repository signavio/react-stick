import React from 'react'

import Stick from '../../src'

function AutoAlignment() {
  return (
    <div>
      <h3>Auto-Alignment</h3>

      <h4>Vertical flipping</h4>
      <div style={{ height: 350 }}>
        <Stick
          autoFlipVertically
          node={
            <div
              style={{ backgroundColor: '#ae0d5c', height: 250, width: 100 }}
            >
              This is the content of the node
            </div>
          }
        >
          <div
            style={{
              width: 200,
              height: 100,
              backgroundColor: 'rgb(24, 170, 177)',
            }}
          >
            The node of this stick should move to the top if it can't fit to the
            bottom
          </div>
        </Stick>
      </div>
    </div>
  )
}

export default AutoAlignment
