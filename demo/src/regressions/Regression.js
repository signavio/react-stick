// @flow
import * as React from 'react'

type PropsT = {
  firefox?: boolean,
  chrome?: boolean,
  ie?: boolean,
  edge?: boolean,
  safari: boolean,
  opera?: boolean,
  allBrowsers?: boolean,
  fixed?: boolean,
  open?: boolean,

  title: string,
  description: string,
  version: string,

  children: React.Node,
}

function Regression({
  firefox,
  chrome,
  ie,
  edge,
  safari,
  opera,
  allBrowsers,
  fixed,
  open,
  version,
  title,
  description,
  children,
}: PropsT) {
  return (
    <div>
      <h2>{title}</h2>
      <p>{description}</p>

      <div style={{ borderBottom: '1px solid gray' }}>
        <strong>Browsers:</strong>
        {firefox && <span style={{ marginLeft: 5 }}>Firefox</span>}
        {chrome && <span style={{ marginLeft: 5 }}>Chrome</span>}
        {ie && <span style={{ marginLeft: 5 }}>IE</span>}
        {edge && <span style={{ marginLeft: 5 }}>Edge</span>}
        {safari && <span style={{ marginLeft: 5 }}>Safari</span>}
        {opera && <span style={{ marginLeft: 5 }}>Opera</span>}
        {allBrowsers && <span style={{ marginLeft: 5 }}>ALL</span>}

        {version && (
          <span style={{ marginLeft: 20 }}>
            <strong>Version:</strong> {version}
          </span>
        )}

        <span style={{ marginLeft: 20 }}>
          <strong style={{ marginRight: 5 }}>Status:</strong>
          {fixed && 'Fixed'}
          {open && 'Open'}
        </span>
      </div>

      <div style={{ padding: 15 }}>{children}</div>
    </div>
  )
}

export default Regression
