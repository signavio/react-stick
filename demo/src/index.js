import React, { Component } from 'react'
import { render } from 'react-dom'

import PositionAlignOverview from './PositionAlignOverview'

class Demo extends Component {
  render() {
    return (
      <div>
        <h1>react-stick Demo</h1>
        <p>
          Open{' '}
          <a href="https://github.com/signavio/react-stick">
            documention on Github
          </a>
        </p>
        <PositionAlignOverview />
      </div>
    )
  }
}

render(<Demo />, document.querySelector('#demo'))
