// @flow
export function scrollX() {
  if (typeof window !== 'undefined') {
    return typeof window.scrollX === 'number'
      ? window.scrollX
      : window.pageXOffset
  }
  return 0
}

export function scrollY() {
  if (typeof window !== 'undefined') {
    return typeof window.scrollY === 'number'
      ? window.scrollY
      : window.pageYOffset
  }
  return 0
}
