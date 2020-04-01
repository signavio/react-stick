import { times } from 'lodash'
import React from 'react'

import Stick from '../../../es'
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

const node = (
  <div
    style={{
      backgroundColor: '#ae0d5c',
      color: 'white',
      minHeight: 18,
    }}
  >
    {times(1, () => 'Lorem ipsum dolor sit amet.').join(' ')}
  </div>
)

export default function FitOnPage() {
  return (
    <Regression
      allBrowsers
      version="1.0.0"
      fixed
      title="Fit on page"
      description="Stick nodes should always fit into the page and never cause a horizontal scrollbar to appear, even after resize"
    >
      <div style={{ display: 'inline-block', width: '90%' }}>
        <Stick position="bottom right" node={node}>
          <Anchor />
        </Stick>
      </div>
    </Regression>
  )
}
