import "@types/jest"

import { InvalidationListener, ObservableValue, WeakInvalidationListener } from "../../../src/observable/beans"

import { gc } from "expose-ts-gc"
import { InvalidationListenerMock } from "./InvalidationListenerMock"

class ObservableMock implements ObservableValue<Record<string, unknown> | null> {

  public removeCounter = 0

  reset() {
    this.removeCounter = 0
  }

  get value(): Record<string, unknown> | null {
    return null
  }

  addListener(_listener: InvalidationListener): void {
    // not used
  }

  removeListener(_listener: InvalidationListener): void {
    this.removeCounter++
  }

  hasListener(_listener: InvalidationListener): boolean {
    // not used
    return false
  }

}

describe("WeakInvalidationListener", function () {
  it("should handle GC", function () {
    let listener: InvalidationListenerMock | null = new InvalidationListenerMock()
    const weakListener = new WeakInvalidationListener(listener)
    const o = new ObservableMock()

    // regular call
    weakListener.invalidated(o)
    listener.check(o, 1)
    expect(weakListener.wasGarbageCollected).toBe(false)

    // GC-ed call
    o.reset()
    listener = null
    gc()
    expect(weakListener.wasGarbageCollected).toBe(true)
    weakListener.invalidated(o)
    expect(o.removeCounter).toEqual(1)
  })
})
