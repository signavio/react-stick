import React, { useState } from 'react'

import Stick from '../..//src'
import Regression from './Regression'

export default function TransportToFixedContainer() {
  const [isOpen, setIsOpen] = useState(false)
  const [container, setContainer] = useState<null | HTMLDivElement>()

  return (
    <Regression
      allBrowsers
      fixed
      version="2.2.0"
      title="Transport to fixed position container"
      description="The stick should be positioned correctly when transported to a container with `position: fixed`"
    >
      <button onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? 'close fixed container' : 'open fixed container'}
      </button>{' '}
      (The fixed container will open at the top left. The sticked node should be
      attached correctly regardless of the page scroll position)
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 20,
            left: 20,
            padding: 32,
            backgroundColor: 'white',
            border: '1px solid silver',
            zIndex: 100,
          }}
          ref={(node) => setContainer(node)}
        >
          <Stick transportTo={container} node="Yes, here it is!">
            <div>There should be a line of text below me</div>
          </Stick>
        </div>
      )}
    </Regression>
  )
}
