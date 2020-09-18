declare module 'invariant' {
  function invariant(condition: boolean, message: string): asserts condition

  export = invariant
}
