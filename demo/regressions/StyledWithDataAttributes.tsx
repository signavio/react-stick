import React from 'react'
import { StylesAsDataAttributes } from 'substyle-glamor'

import Stick from '../..//src'
import Regression from './Regression'

export default function StyledWithDataAttributes() {
  return (
    <Regression
      allBrowsers
      fixed
      version="2.1.0"
      title="Should not expect a style attribute"
      description="The Stick component should not expect a `style` property to be present on its props."
    >
      <StylesAsDataAttributes>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Stick
            position={['bottom', 'center']}
            node={
              <div
                style={{
                  backgroundColor: '#ae0d5c',
                  color: 'white',
                  width: 100,
                }}
              >
                Node
              </div>
            }
          >
            <div style={{ backgroundColor: 'rgb(24, 170, 177)', width: 200 }}>
              Anchor
            </div>
          </Stick>
        </div>
      </StylesAsDataAttributes>
    </Regression>
  )
}
