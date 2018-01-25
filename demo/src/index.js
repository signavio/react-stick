import React, { Component } from 'react'
import { render } from 'react-dom'

import Stick from '../../src'

class Demo extends Component {
  render() {
    return (
      <div>
        <h1>react-stick Demo</h1>
        <Stick />
      </div>
    )
  }
}

render(<Demo />, document.querySelector('#demo'))
