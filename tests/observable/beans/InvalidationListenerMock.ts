import { expect } from "@jest/globals"

import { InvalidationListener, Observable } from "../../../src"

export class InvalidationListenerMock implements InvalidationListener {
  private observable: Observable | null

  private counter: number

  constructor() {
    this.observable = null
    this.counter = 0
  }

  invalidated(observable: Observable): void {
    this.observable = observable
    this.counter++
  }

  reset() {
    this.observable = null
    this.counter = 0
  }

  check(observable: Observable | null, counter: number) {
    expect(this.observable).toBe(observable)
    expect(this.counter).toEqual(counter)
    this.reset()
  }
}
