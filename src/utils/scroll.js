// @flow
export function scrollX(node: ?Node): number {
  if (!node) {
    return 0
  }

  if (!(node instanceof HTMLElement)) {
    return 0
  }

  return node.scrollLeft + scrollX(node.parentNode)
}

export function scrollY(): number {
  if (typeof window !== 'undefined') {
    return typeof window.scrollY === 'number'
      ? window.scrollY
      : window.pageYOffset
  }
  return 0
}
