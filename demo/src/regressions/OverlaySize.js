import React from 'react'

import Stick from '../../../src'

import Regression from './Regression'

const Box = ({ width }) => (
  <div style={{ backgroundColor: 'red', height: 15, width }} />
)

export default function OverlaySize() {
  return (
    <Regression
      allBrowsers
      open
      version="1.0.0"
      title="Overlay size"
      description="The overlay should not line-break just because the stick target is small."
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          height: 200,
        }}
      >
        <Stick position="middle right" node="This text should stay on one line">
          <Box width={15} />
        </Stick>

        <Stick position="middle right" node="This text should stay on one line">
          <Box width={50} />
        </Stick>

        <Stick position="middle right" node="This text should stay on one line">
          <Box width={150} />
        </Stick>
      </div>
    </Regression>
  )
}
