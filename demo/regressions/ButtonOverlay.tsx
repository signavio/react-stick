import React from 'react'

import Stick from '../../../src'
import Regression from './Regression'

export default function ButtonOverlay() {
  return (
    <Regression
      allBrowsers
      fixed
      title="Button overlay"
      description="Stick created an element that prevented clicks to wrapped elements"
    >
      <Stick node="This is the stick text">
        <button>You should be able to click me</button>
      </Stick>
    </Regression>
  )
}
