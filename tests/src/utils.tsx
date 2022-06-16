import { mount } from '@cypress/react'
import React from 'react'

const InlineWrapper = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'inline-block' }}>{children}</div>
)

export function wrapRender(
  component: React.ReactNode,
  Wrapper: React.ComponentType<{ children: React.ReactNode }> = InlineWrapper,
  render: (component: React.ReactNode) => ReturnType<typeof mount> = mount
): ReturnType<typeof mount> {
  return render(<Wrapper>{component}</Wrapper>)
    .then(({ component, rerender, unmount }) => ({
      component,
      rerender: (component: React.ReactNode) =>
        wrapRender(component, Wrapper, rerender),
      unmount,
    }))
    .wait(100)
}

export function render(component: React.ReactNode): ReturnType<typeof mount> {
  return wrapRender(component)
}

export function batchFindByTestId(selectors: string[]) {
  return cy
    .wrap<Promise<JQuery<HTMLElement>[]>, JQuery<HTMLElement>[]>(
      Promise.all(
        selectors.map(
          (selector) =>
            new Promise<JQuery>((resolve) =>
              cy.findByTestId(selector).then(resolve)
            )
        )
      )
    )
    .wait(100)
}
