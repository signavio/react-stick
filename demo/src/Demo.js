import React from 'react'

import Regressions from './regressions'

import PositionAlignOverview from './PositionAlignOverview'
import AutoAlignment from './AutoAlignment'

export default function Demo() {
  return (
    <div>
      <h1>react-stick</h1>

      <p>
        <a href="https://github.com/signavio/react-stick">
          Open documention on Github
        </a>
      </p>

      <PositionAlignOverview />

      <AutoAlignment />

      <Regressions />
    </div>
  )
}
