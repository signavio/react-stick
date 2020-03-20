// @flow

let counter = 1

function uniqueId(): number {
  return counter++
}

export default uniqueId
