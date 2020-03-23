import { compact } from 'lodash'
import React, { Component, useState } from 'react'

import Stick from '../../src'

const formPairs = (listA: Array<string>, listB: Array<string>) =>
  compact(
    listA.map((a: string) =>
      listB.map((b: string) => {
        if (a === b) {
          return null
        }

        return `${a} ${b}`
      })
    )
  )

const verticals = ['top', 'middle', 'bottom']
const horizontals = ['left', 'center', 'right']

const positionGroups = formPairs(verticals, horizontals)
const alignmentGroups = formPairs(verticals, horizontals)

const Anchor = () => (
  <div
    style={{
      width: 35,
      height: 35,
      backgroundColor: 'rgb(24, 170, 177)',
    }}
  />
)

const Node = () => (
  <div
    style={{
      width: 10,
      height: 10,
      backgroundColor: '#ae0d5c',
    }}
  />
)

class FramesPerSecond extends Component {
  state = {
    fps: 0,
  }

  lastUpdated = Date.now()
  framesSinceLastUpdate = 0

  startTracking() {
    const requestCallback = this.props.updateOnAnimationFrame
      ? requestAnimationFrame
      : requestIdleCallback
    this.lastCallbackAsAnimationFrame = this.props.updateOnAnimationFrame

    this.animationId = requestCallback(() => this.startTracking())
    this.measure()
  }

  measure() {
    this.framesSinceLastUpdate += 1
    let duration = Date.now() - this.lastUpdated
    if (duration >= 1000) {
      this.setState({
        fps: this.framesSinceLastUpdate,
      })
      this.framesSinceLastUpdate = 0
      this.lastUpdated = Date.now()
    }
  }

  componentDidMount() {
    this.startTracking()
  }

  render() {
    return <div>FPS: {this.state.fps}</div>
  }
}
function PositionAlignOverview() {
  const [updateOnAnimationFrame, setUpdateOnAnimationFrame] = useState(false)
  const [inline, setInline] = useState(false)
  const [showNode, setShowNode] = useState(true)

  return (
    <div>
      <p>
        The table shows all combinations of possible values for the{' '}
        <code>position</code> and <code>align</code> props. The{' '}
        <code>node</code> elements are colors in red while the anchor elements (
        <code>children</code>) are colored in blue.
      </p>
      <div>
        <input
          type="checkbox"
          checked={inline}
          onChange={() => setInline(!inline)}
        />
        <code>inline</code>
      </div>
      <div>
        <input
          type="checkbox"
          checked={updateOnAnimationFrame}
          onChange={() => setUpdateOnAnimationFrame(!updateOnAnimationFrame)}
        />
        <code>updateOnAnimationFrame</code>
      </div>
      <div>
        <input
          type="checkbox"
          checked={showNode}
          onChange={() => setShowNode(!showNode)}
        />
        <code>showNode</code>
      </div>
      <div>
        <textarea
          readOnly
          defaultValue="resize me to check smoothness of Stick"
        />
        <FramesPerSecond updateOnAnimationFrame={updateOnAnimationFrame} />
      </div>
      <table
        style={{
          textAlign: 'center',
          borderCollapse: 'collapse',
        }}
      >
        <tbody
          style={{
            borderTop: '1px solid black',
            borderRight: '1px solid black',
          }}
        >
          {positionGroups.map((positions: Array<string>, i: number) => (
            <tr key={i}>
              {positions.map((position: string) => (
                <td
                  key={position}
                  style={{
                    padding: '0 10px 10px 10px',
                    borderLeft: '1px solid black',
                    borderBottom: '1px solid black',
                    fontSize: 11,
                  }}
                >
                  <pre>position="{position}"</pre>
                  <br />
                  <div style={{ display: 'inline-block' }}>
                    <Stick
                      inline={inline}
                      updateOnAnimationFrame={updateOnAnimationFrame}
                      position={position}
                      node={showNode && <Node />}
                    >
                      <Anchor />
                    </Stick>
                  </div>

                  <table
                    style={{
                      borderCollapse: 'collapse',
                      marginTop: 20,
                    }}
                  >
                    <tbody
                      style={{
                        borderTop: '1px solid gray',
                        borderRight: '1px solid gray',
                      }}
                    >
                      {alignmentGroups.map(
                        (alignments: Array<string>, j: number) => (
                          <tr key={j}>
                            {alignments.map((alignment: string) => (
                              <td
                                key={alignment}
                                style={{
                                  padding: '0 10px 10px 10px',
                                  borderLeft: '1px solid gray',
                                  borderBottom: '1px solid gray',
                                  fontSize: 11,
                                }}
                              >
                                <pre>align="{alignment}"</pre>
                                <br />
                                <div style={{ display: 'inline-block' }}>
                                  <Stick
                                    position={position}
                                    align={alignment}
                                    inline={inline}
                                    updateOnAnimationFrame={
                                      updateOnAnimationFrame
                                    }
                                    node={showNode && <Node />}
                                  >
                                    <Anchor />
                                  </Stick>
                                </div>
                              </td>
                            ))}
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default PositionAlignOverview
