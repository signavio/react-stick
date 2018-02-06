import React from 'react'

import PositionAlignOverview from './PositionAlignOverview'
import Regressions from './regressions'

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

      <Regressions />
    </div>
  )
}
